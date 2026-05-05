import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { Request } from 'express';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}


  // ⭐ GET LOGS
  @Get()
  getLogs(@Query() query: any) {
    return this.logsService.getLogs(query);
  }
}