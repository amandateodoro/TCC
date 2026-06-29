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
    description: 'Ano usado no resumo. Se nao for informado, usa o ano atual.',
    type: Number,
  })
  @ApiQuery({
    name: 'mes',
    required: false,
    description: 'Mes usado no resumo. Se nao for informado, usa o mes atual.',
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
