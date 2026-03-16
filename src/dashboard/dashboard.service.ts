import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getStats() {
    const result = await this.dataSource.query(`
      SELECT
        (SELECT COUNT(*)::int FROM societies) AS "totalSocieties",
        (SELECT COUNT(*)::int FROM users WHERE status = 'active') AS "activeUsers",
        (
          SELECT COALESCE(SUM(amount), 0)::float
          FROM payments
          WHERE status = 'success'
            AND DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', CURRENT_DATE)
        ) AS "monthlyRevenue",
        (
          SELECT COUNT(*)::int
          FROM subscriptions
          WHERE status = 'active'
        ) AS "activeSubscriptions"
    `);

    return {
      totalSocieties: Number(result[0]?.totalSocieties || 0),
      activeUsers: Number(result[0]?.activeUsers || 0),
      monthlyRevenue: Number(result[0]?.monthlyRevenue || 0),
      activeSubscriptions: Number(result[0]?.activeSubscriptions || 0),
    };
  }

async getRevenueGrowth() {
  const result = await this.dataSource.query(`
    SELECT
      TO_CHAR(DATE_TRUNC('month', payment_date), 'Mon') AS month,
      EXTRACT(YEAR FROM payment_date)::int AS year,
      EXTRACT(MONTH FROM payment_date)::int AS monthNumber,
      COALESCE(SUM(amount), 0)::float AS revenue
    FROM payments
    WHERE status = 'success'
      AND payment_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
    GROUP BY DATE_TRUNC('month', payment_date),
             EXTRACT(YEAR FROM payment_date),
             EXTRACT(MONTH FROM payment_date)
    ORDER BY EXTRACT(YEAR FROM payment_date),
             EXTRACT(MONTH FROM payment_date)
  `);

  const months: {
    month: string;
    year: number;
    monthNumber: number;
    revenue: number;
  }[] = [];

  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const monthNumber = date.getMonth() + 1;

    const existing = result.find(
      (item: any) =>
        Number(item.year) === year &&
        Number(item.monthnumber || item.monthNumber) === monthNumber,
    );

    months.push({
      month,
      year,
      monthNumber,
      revenue: existing ? Number(existing.revenue) : 0,
    });
  }

  return months.map(({ month, year, revenue }) => ({
    month,
    year,
    revenue,
  }));
}
}