import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ContribuinteService } from './contribuinte.service';
import { CreateContribuinteDto } from './dto/create-contribuinte.dto';
import { UpdateContribuinteDto } from './dto/update-contribuinte.dto';

@Controller('contribuintes')
export class ContribuinteController {
  constructor(private readonly service: ContribuinteService) {}

  @Post()
  create(@Body() dto: CreateContribuinteDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get('aniversariantes')
  birthdays(@Query('mes') mes?: string) {
    return this.service.birthdaysByMonth(mes ? Number(mes) : new Date().getMonth() + 1);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContribuinteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
