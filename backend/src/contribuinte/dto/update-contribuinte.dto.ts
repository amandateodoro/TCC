import { PartialType } from '@nestjs/swagger';
import { CreateContribuinteDto } from './create-contribuinte.dto';

export class UpdateContribuinteDto extends PartialType(CreateContribuinteDto) {}
