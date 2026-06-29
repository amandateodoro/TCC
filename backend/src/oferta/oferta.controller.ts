import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';
import { OfertaService } from './oferta.service';

@ApiTags('Ofertas')
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

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOfertaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
