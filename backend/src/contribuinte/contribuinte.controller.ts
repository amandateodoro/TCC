import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContribuinteService } from './contribuinte.service';
import { CreateContribuinteDto } from './dto/create-contribuinte.dto';
import { UpdateContribuinteDto } from './dto/update-contribuinte.dto';

@ApiTags('Contribuintes')
@Controller('contribuintes')
export class ContribuinteController {
  constructor(private readonly service: ContribuinteService) {}

  @Post()
  create(@Body() dto: CreateContribuinteDto) {
    return this.service.create(dto);
  }

  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filtra contribuintes por nome.',
    type: String,
  })
  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @ApiQuery({
    name: 'mes',
    required: false,
    description: 'Mes usado para buscar aniversariantes. Se nao for informado, usa o mes atual.',
    type: Number,
  })
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
