import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ACESSO_FINANCEIRO, Roles } from '../auth/auth.roles';
import { CategoriaDespesaService } from './categoria-despesa.service';

@ApiTags('Categorias de despesa')
@Roles(...ACESSO_FINANCEIRO)
@Controller('categorias-despesa')
export class CategoriaDespesaController {
  constructor(private readonly service: CategoriaDespesaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
