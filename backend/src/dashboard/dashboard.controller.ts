import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @ApiQuery({
    name: 'ano',
    required: false,
    description: 'Digite o ano. Se não for informado, usa o ano atual.',
    type: Number,
  })
  @ApiQuery({
    name: 'mes',
    required: false,
    description: 'Digite o mês. Se não for informado, usa o mês atual.',
    type: Number,
  })
  @Get()
  getSummary(@Query('ano') ano?: string, @Query('mes') mes?: string) {
    const now = new Date();
    return this.service.getSummary({
      ano: ano ? Number(ano) : now.getFullYear(),
      mes: mes ? Number(mes) : now.getMonth() + 1,
    });
  }
}
