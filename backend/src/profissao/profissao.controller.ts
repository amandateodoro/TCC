import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateProfissaoDto } from './dto/create-profissao.dto';
import { UpdateProfissaoDto } from './dto/update-profissao.dto';
import { ProfissaoService } from './profissao.service';

@Controller('profissoes')
export class ProfissaoController {
  constructor(private readonly service: ProfissaoService) {}

  @Post()
  create(@Body() dto: CreateProfissaoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProfissaoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
