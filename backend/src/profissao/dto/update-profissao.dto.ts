import { PartialType } from '@nestjs/mapped-types';
import { CreateProfissaoDto } from './create-profissao.dto';

export class UpdateProfissaoDto extends PartialType(CreateProfissaoDto) {}
