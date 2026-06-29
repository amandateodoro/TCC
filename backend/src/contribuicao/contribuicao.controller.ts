import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContribuicaoService } from './contribuicao.service';
import { CreateContribuicaoDto } from './dto/create-contribuicao.dto';
import { UpdateContribuicaoDto } from './dto/update-contribuicao.dto';

@ApiTags('Contribuicoes')
@Controller('contribuicoes')
export class ContribuicaoController {
  constructor(private readonly service: ContribuicaoService) {}

  @Post()
  create(@Body() dto: CreateContribuicaoDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContribuicaoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
