import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ACESSO_FINANCEIRO, Roles } from '../auth/auth.roles';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { OfertaService } from './oferta.service';

@ApiTags('Ofertas')
@Roles(...ACESSO_FINANCEIRO)
@Controller('ofertas')
export class OfertaController {
  constructor(private readonly service: OfertaService) {}

  @Post()
  create(@Body() dto: CreateOfertaDto) {
    return this.service.create(dto);
  }

  @ApiQuery({
    name: 'inicio',
    required: false,
    description: 'Data inicial do filtro no formato AAAA-MM-DD.',
    type: String,
  })
  @ApiQuery({
    name: 'fim',
    required: false,
    description: 'Data final do filtro no formato AAAA-MM-DD.',
    type: String,
  })
  @Get()
  findAll(@Query('inicio') inicio?: string, @Query('fim') fim?: string) {
    return this.service.findAll(inicio, fim);
  }

}
