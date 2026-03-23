import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateAnnouncementDto } from '../announcements/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private dataSource: DataSource) {}

  // ⭐ CREATE ANNOUNCEMENT
  async createAnnouncement(dto: CreateAnnouncementDto) {
    const result = await this.dataSource.query(
      `
      INSERT INTO announcements (title, content, created_by)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [dto.title, dto.content, dto.created_by],
    );

    return result[0];
  }

  // ⭐ GET ALL ANNOUNCEMENTS
  async getAnnouncements() {
    const result = await this.dataSource.query(`
      SELECT
        id,
        title,
        content,
        created_by,
        created_at
      FROM announcements
      ORDER BY created_at DESC
    `);

    return result;
  }
}