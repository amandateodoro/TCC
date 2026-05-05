import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContribuinteModule } from '../contribuinte/contribuinte.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { ContribuicaoController } from './contribuicao.controller';
import { Contribuicao } from './contribuicao.entity';
import { ContribuicaoService } from './contribuicao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contribuicao]), ContribuinteModule, UsuarioModule],
  controllers: [ContribuicaoController],
  providers: [ContribuicaoService],
  exports: [ContribuicaoService],
})
export class ContribuicaoModule {}
