import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProfissaoService } from './profissao.service';

@ApiTags('Profissões')
@Controller('profissoes')
export class ProfissaoController {
  constructor(private readonly service: ProfissaoService) {}

  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Nome ou código CBO.',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de profissões retornadas.',
    type: Number,
  })
  @Get()
  findAll(@Query('search') search?: string, @Query('limit') limit?: string) {
    return this.service.findAll(search, limit ? Number(limit) : 20);
  }
}
