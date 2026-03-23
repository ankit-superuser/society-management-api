import { Controller, Get, Post, Body } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from '../announcements/create-announcement.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  // ⭐ POST — Create Announcement
  @Post('create')
  create(@Body() dto: CreateAnnouncementDto) {
    return this.service.createAnnouncement(dto);
  }

  // ⭐ GET — Previous Announcements
  @Get('all')
  findAll() {
    return this.service.getAnnouncements();
  }
}