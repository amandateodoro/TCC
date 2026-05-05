import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  getSummary(@Query('ano') ano?: string, @Query('mes') mes?: string) {
    const now = new Date();
    return this.service.getSummary({
      ano: ano ? Number(ano) : now.getFullYear(),
      mes: mes ? Number(mes) : now.getMonth() + 1,
    });
  }
}
