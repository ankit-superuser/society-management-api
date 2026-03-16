import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { DashboardModule } from './dashboard/dashboard.module';



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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }