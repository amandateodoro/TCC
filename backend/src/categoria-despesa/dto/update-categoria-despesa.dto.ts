import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDespesaDto } from './create-categoria-despesa.dto';

export class UpdateCategoriaDespesaDto extends PartialType(CreateCategoriaDespesaDto) {}
