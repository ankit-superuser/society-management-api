import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Society } from '../societies/society-entities';
import { SocietyService } from './societies.service';
import { SocietyController } from './societies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Society]),  // 💥 THIS FIXES ERROR
  ],
  controllers: [SocietyController],
  providers: [SocietyService],
})
export class SocietiesModule {}