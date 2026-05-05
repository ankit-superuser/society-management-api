import { Controller, Get, Query } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Super Admin', 'Society Admin')
  getStats() {
    return this.service.getStats();
  }

    @Get('list')
      @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Super Admin', 'Society Admin')
  getSubscriptions(@Query() query) {
    return this.service.getSubscriptions(query);
  }
}