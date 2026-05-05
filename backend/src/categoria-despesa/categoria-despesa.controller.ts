import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoriaDespesaService } from './categoria-despesa.service';
import { CreateCategoriaDespesaDto } from './dto/create-categoria-despesa.dto';
import { UpdateCategoriaDespesaDto } from './dto/update-categoria-despesa.dto';

@Controller('categorias-despesa')
export class CategoriaDespesaController {
  constructor(private readonly service: CategoriaDespesaService) {}

  @Post()
  create(@Body() dto: CreateCategoriaDespesaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDespesaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
