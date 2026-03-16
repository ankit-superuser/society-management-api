import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';

@Controller()
export class AppController {
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin')
  adminOnly(@Req() req) {
    return {
      message: 'Welcome Super Admin',
      user: req.user,
    };
  }

  @Get('society-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Society Admin')
  societyAdmin(@Req() req) {
    return {
      message: 'Welcome Society Admin or Super Admin',
      user: req.user,
    };
  }
}