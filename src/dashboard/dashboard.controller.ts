import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super Admin', 'Society Admin')
  async getStats() {
    const data = await this.dashboardService.getStats();

    return {
      message: 'Dashboard stats fetched successfully',
      data,
    };
  }

  @Get('revenue-growth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super Admin', 'Society Admin')
async getRevenueGrowth() {
  const data = await this.dashboardService.getRevenueGrowth();

  return {
    message: 'Revenue growth data fetched successfully',
    data,
  };
}
}