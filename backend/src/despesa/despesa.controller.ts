import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { DespesaService } from './despesa.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

@Controller('despesas')
export class DespesaController {
  constructor(private readonly service: DespesaService) {}

  @Post()
  create(@Body() dto: CreateDespesaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('inicio') inicio?: string, @Query('fim') fim?: string) {
    return this.service.findAll(inicio, fim);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDespesaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
