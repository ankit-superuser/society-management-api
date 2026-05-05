import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { LogsModule } from './logs/logs.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db.whhmgsryqatotcluccof.supabase.co',
      port: 5432,
      username: 'postgres',
      password: 'Ecommerce2439#29',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: false, // Set to false in production
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    DashboardModule,
    SocietiesModule,
    SubscriptionsModule,
    RevenueModule,
    AnnouncementsModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }