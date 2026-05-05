import { PartialType } from '@nestjs/mapped-types';
import { CreateContribuinteDto } from './create-contribuinte.dto';

export class UpdateContribuinteDto extends PartialType(CreateContribuinteDto) {}
