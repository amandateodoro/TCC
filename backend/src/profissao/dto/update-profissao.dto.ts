import { PartialType } from '@nestjs/swagger';
import { CreateProfissaoDto } from './create-profissao.dto';

export class UpdateProfissaoDto extends PartialType(CreateProfissaoDto) {}
