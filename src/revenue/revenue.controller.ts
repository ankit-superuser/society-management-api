import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Param, Res } from '@nestjs/common';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  // ⭐ Revenue Stats Cards API
  @Get('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
  getRevenueStats() {
    return this.revenueService.getRevenueStats();
  }
  @Get('trend')
getRevenueTrend() {
  return this.revenueService.getRevenueTrend();
}

@Get('by-plan')
getRevenueByPlan() {
  return this.revenueService.getRevenueByPlan();
}
@Get('invoices')
getInvoices(@Query() query: any) {
  return this.revenueService.getInvoices(query);
}
// @Get('invoice/:id/download')
// downloadInvoice(@Param('id') id: number, @Res() res) {
//   return this.revenueService.generateInvoicePdf(id, res);
// }
}