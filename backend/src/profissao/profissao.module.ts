import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfissaoController } from './profissao.controller';
import { Profissao } from './profissao.entity';
import { ProfissaoService } from './profissao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profissao])],
  controllers: [ProfissaoController],
  providers: [ProfissaoService],
  exports: [ProfissaoService],
})
export class ProfissaoModule {}
