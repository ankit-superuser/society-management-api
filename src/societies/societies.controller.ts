// society.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SocietyService } from '../societies/societies.service';
import { CreateSocietyDto } from './dto/create-society.dto';
import { Society } from './society-entities';

@Controller('societies')
export class SocietyController {
  constructor(private readonly societyService: SocietyService) {}

  @Post('add')
  async create(
    @Body() createSocietyDto: CreateSocietyDto,
  ): Promise<Society> {
    return this.societyService.create(createSocietyDto);
  }
}