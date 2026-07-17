import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriaDespesaService } from './categoria-despesa.service';

@ApiTags('Categorias de despesa')
@Controller('categorias-despesa')
export class CategoriaDespesaController {
  constructor(private readonly service: CategoriaDespesaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
