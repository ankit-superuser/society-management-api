import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Body, Post, Req } from '@nestjs/common';
import express from 'express';
import { AddSocietyDto } from './dto/add-society.dto';

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


@Get('subscription-status')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super Admin', 'Society Admin')
async getSubscriptionStatus() {
  const data = await this.dashboardService.getSubscriptionStatus();

  return {
    message: 'Subscription status fetched successfully',
    data,
  };
}

@Get('recent-societies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super Admin', 'Society Admin')
async getRecentSocieties() {
  const data = await this.dashboardService.getRecentSocieties();

  return {
    message: 'Recent societies fetched successfully',
    data,
  };
}

@Get('recent-tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super Admin', 'Society Admin')
async getRecentTickets() {
  const data = await this.dashboardService.getRecentTickets();

  return {
    message: 'Recent tickets fetched successfully',
    data,
  };
}


@Post('add-societies')
// @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super Admin')
async addSociety(@Body() body: AddSocietyDto, @Req() req: express.Request) {
const userId = (req.user as any)?.id;
  const data = await this.dashboardService.addSociety(body, userId);

  return {
    message: 'Society created successfully',
    data,
  };
}

}
