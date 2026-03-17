// society.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Society } from './society-entities';
import { CreateSocietyDto } from './dto/create-society.dto';

@Injectable()
export class SocietyService {
  constructor(
    @InjectRepository(Society)
    private societyRepo: Repository<Society>,
  ) {}

  async create(createSocietyDto: CreateSocietyDto): Promise<Society> {
    const society = this.societyRepo.create(createSocietyDto);
    return await this.societyRepo.save(society);
  }
}