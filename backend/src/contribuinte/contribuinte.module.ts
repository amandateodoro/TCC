import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContribuinteController } from './contribuinte.controller';
import { Contribuinte } from './contribuinte.entity';
import { ContribuinteService } from './contribuinte.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contribuinte])],
  controllers: [ContribuinteController],
  providers: [ContribuinteService],
  exports: [ContribuinteService],
})
export class ContribuinteModule {}
