import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SocietiesModule } from './societies/societies.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RevenueModule } from './revenue/revenue.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
      servername: 'aws-1-ap-northeast-1.pooler.supabase.com',
    },
  },
}),
    AuthModule,
    UsersModule,
    RolesModule,
    DashboardModule,
    SocietiesModule,
    SubscriptionsModule,
    RevenueModule,
    AnnouncementsModule,
    AuditLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}