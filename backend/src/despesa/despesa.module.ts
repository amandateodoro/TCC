import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaDespesaModule } from '../categoria-despesa/categoria-despesa.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { DespesaController } from './despesa.controller';
import { Despesa } from './despesa.entity';
import { DespesaService } from './despesa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Despesa]), CategoriaDespesaModule, UsuarioModule],
  controllers: [DespesaController],
  providers: [DespesaService],
  exports: [DespesaService],
})
export class DespesaModule {}
