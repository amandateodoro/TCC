import { PartialType } from '@nestjs/mapped-types';
import { CreateContribuicaoDto } from './create-contribuicao.dto';

export class UpdateContribuicaoDto extends PartialType(CreateContribuicaoDto) {}
