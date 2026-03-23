import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SubscriptionsService {
  constructor(private dataSource: DataSource) {}

  // ⭐ STATS API
  async getStats() {
    const result = await this.dataSource.query(`
      SELECT
        COUNT(*) FILTER (WHERE s.status = 'active') AS active_subscriptions,

        COUNT(*) FILTER (
          WHERE s.status = 'active'
          AND s.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        ) AS expiring_soon,

        COALESCE(SUM(p.price), 0) AS monthly_revenue

      FROM subscriptions s
      JOIN plans p ON p.id = s.plan_id
      WHERE s.status = 'active'
    `);

    return result[0];
  }

  // ⭐ TABLE API
  async getSubscriptions(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const { status, plan, search } = query;

    const offset = (page - 1) * limit;

    let sql = `
      SELECT
        s.id,
        so.name AS society,
        p.name AS plan,
        s.start_date,
        s.end_date,
        p.price AS amount,
        s.status
      FROM subscriptions s
      JOIN societies so ON so.id = s.society_id
      JOIN plans p ON p.id = s.plan_id
      WHERE 1=1
    `;

const params: (string | number)[] = [];
    let i = 1;

    if (status) {
      sql += ` AND s.status = $${i++}`;
      params.push(status);
    }

    if (plan) {
      sql += ` AND p.name = $${i++}`;
      params.push(plan);
    }

    if (search) {
      sql += ` AND so.name ILIKE $${i++}`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY s.start_date DESC LIMIT $${i++} OFFSET $${i++}`;
    params.push(limit, offset);

    const data = await this.dataSource.query(sql, params);

    // ⭐ Total count for pagination
    const totalResult = await this.dataSource.query(`
      SELECT COUNT(*) FROM subscriptions
    `);

    return {
      data,
       page,
      limit,
      total: Number(totalResult[0].count),
    };
  }
}