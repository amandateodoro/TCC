import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfissaoModule } from '../profissao/profissao.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { ContribuinteController } from './contribuinte.controller';
import { Contribuinte } from './contribuinte.entity';
import { ContribuinteService } from './contribuinte.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contribuinte]), ProfissaoModule, UsuarioModule],
  controllers: [ContribuinteController],
  providers: [ContribuinteService],
  exports: [ContribuinteService],
})
export class ContribuinteModule {}
