import { PartialType } from '@nestjs/swagger';
import { CreateContribuicaoDto } from './create-contribuicao.dto';

export class UpdateContribuicaoDto extends PartialType(CreateContribuicaoDto) {}
