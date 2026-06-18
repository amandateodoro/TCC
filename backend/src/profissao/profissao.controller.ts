import { Controller, Get, Query } from '@nestjs/common';
import { ProfissaoService } from './profissao.service';

@Controller('profissoes')
export class ProfissaoController {
  constructor(private readonly service: ProfissaoService) {}

  @Get()
  findAll(@Query('search') search?: string, @Query('limit') limit?: string) {
    return this.service.findAll(search, limit ? Number(limit) : 20);
  }
}
