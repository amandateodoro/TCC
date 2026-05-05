import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaDespesaController } from './categoria-despesa.controller';
import { CategoriaDespesa } from './categoria-despesa.entity';
import { CategoriaDespesaService } from './categoria-despesa.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaDespesa])],
  controllers: [CategoriaDespesaController],
  providers: [CategoriaDespesaService],
  exports: [CategoriaDespesaService],
})
export class CategoriaDespesaModule {}
