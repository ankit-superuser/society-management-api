import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  getAllLogs(@Query() query: any) {
    return this.auditLogsService.findAll(query);
  }

  @Post()
  createLog(@Body() body: any) {
    return this.auditLogsService.create(body);
  }
}