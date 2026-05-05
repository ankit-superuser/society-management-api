import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SocietiesService {
  constructor(private readonly dataSource: DataSource) {}

  async createSociety(body: any) {
    const { name, city, adminName, phone, planId } = body;

    return await this.dataSource.transaction(async (manager) => {

      // 1️⃣ Create Society
      const societyResult = await manager.query(
        `
        INSERT INTO societies (name, city)
        VALUES ($1, $2)
        RETURNING id, name, city
        `,
        [name, city],
      );

      const society = societyResult[0];

      // 2️⃣ Create Admin User
      const userResult = await manager.query(
        `
        INSERT INTO users (full_name, phone, status)
        VALUES ($1, $2, 'active')
        RETURNING id
        `,
        [adminName, phone],
      );

      const userId = userResult[0].id;

      // 3️⃣ Add as Society Member (Admin)
      await manager.query(
        `
        INSERT INTO society_members (society_id, user_id, role)
        VALUES ($1, $2, 'Admin')
        `,
        [society.id, userId],
      );

      // 4️⃣ Create Subscription
      await manager.query(
        `
        INSERT INTO subscriptions (society_id, plan_id, status, start_date)
        VALUES ($1, $2, 'active', CURRENT_DATE)
        `,
        [society.id, planId],
      );

      return {
        societyId: society.id,
        name: society.name,
        city: society.city,
      };
    });
  }
}