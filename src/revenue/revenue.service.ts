import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class RevenueService {
  constructor(private dataSource: DataSource) {}

  async getRevenueStats() {
    const result = await this.dataSource.query(`
      SELECT

        -- ⭐ Total Revenue (all-time successful payments)
        COALESCE(SUM(p.amount), 0) AS total_revenue,

        -- ⭐ Monthly Revenue (this month)
        COALESCE(SUM(
          CASE
            WHEN DATE_TRUNC('month', p.payment_date) =
                 DATE_TRUNC('month', CURRENT_DATE)
            THEN p.amount
          END
        ), 0) AS monthly_recurring_revenue,

        -- ⭐ Active subscriptions count
        COUNT(DISTINCT s.id)
          FILTER (WHERE s.status = 'active') AS active_subscriptions

      FROM payments p
      LEFT JOIN subscriptions s
        ON s.id = p.subscription_id

      WHERE p.status = 'success'
    `);

    const stats = result[0];

    const perActive =
      stats.active_subscriptions > 0
        ? stats.monthly_recurring_revenue / stats.active_subscriptions
        : 0;

    return {
      total_revenue: Number(stats.total_revenue),
      monthly_recurring_revenue: Number(stats.monthly_recurring_revenue),
      per_active_subscription: Number(perActive.toFixed(2)),
    };
  }


 async getRevenueTrend() {
  const result = await this.dataSource.query(`
    SELECT
      TO_CHAR(month, 'Mon') AS month,
      SUM(amount) AS revenue
    FROM (
      SELECT
        DATE_TRUNC('month', payment_date) AS month,
        amount
      FROM payments
      WHERE status = 'success'
        AND payment_date >= CURRENT_DATE - INTERVAL '12 months'
    ) t
    GROUP BY month
    ORDER BY month
  `);

  return result.map(r => ({
    month: r.month,
    revenue: Number(r.revenue),
  }));
}

async getRevenueByPlan() {
  const result = await this.dataSource.query(`
    SELECT
      pl.name AS plan,
      COALESCE(SUM(p.amount), 0) AS revenue
    FROM payments p
    JOIN subscriptions s
      ON s.id = p.subscription_id
    JOIN plans pl
      ON pl.id = s.plan_id
    WHERE p.status = 'success'
    GROUP BY pl.name
    ORDER BY revenue DESC
  `);

  return result.map(r => ({
    plan: r.plan,
    revenue: Number(r.revenue),
  }));
}

async getInvoices(query: any) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  const result = await this.dataSource.query(`
    SELECT
      p.id,
      'INV-' || LPAD(p.id::text, 3, '0') AS invoice_id,
      so.name AS society,
      p.amount,
      p.payment_date AS date,
      CASE
        WHEN p.status = 'success' THEN 'Paid'
        ELSE 'Pending'
      END AS status
    FROM payments p
    JOIN subscriptions s ON s.id = p.subscription_id
    JOIN societies so ON so.id = s.society_id
    ORDER BY p.payment_date DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  return result;
}

}