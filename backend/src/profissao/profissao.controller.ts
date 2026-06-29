import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProfissaoService } from './profissao.service';

@ApiTags('Profissoes')
@Controller('profissoes')
export class ProfissaoController {
  constructor(private readonly service: ProfissaoService) {}

  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filtra profissoes por nome ou codigo CBO.',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade maxima de profissoes retornadas.',
    type: Number,
  })
  @Get()
  findAll(@Query('search') search?: string, @Query('limit') limit?: string) {
    return this.service.findAll(search, limit ? Number(limit) : 20);
  }
}
