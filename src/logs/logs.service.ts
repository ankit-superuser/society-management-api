import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class LogsService {
  constructor(private dataSource: DataSource) {}

  // ⭐ CREATE LOG (with IP)
  async createLog(data: any, ip: string) {
    const result = await this.dataSource.query(
      `
      INSERT INTO logs (user_id, action, entity, entity_id, ip_address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        data.user_id,
        data.action,
        data.entity,
        data.entity_id,
        ip,
      ],
    );

    return result[0];
  }

  // ⭐ GET LOGS (for table)
  async getLogs(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await this.dataSource.query(
      `
      SELECT
        l.id,
        l.created_at AS timestamp,
        u.name AS user,
        l.action,
        l.entity,
        l.entity_id,
        l.ip_address
      FROM logs l
      JOIN users u ON u.id = l.user_id
      ORDER BY l.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    return {
      page,
      limit,
      data: result,
    };
  }
}