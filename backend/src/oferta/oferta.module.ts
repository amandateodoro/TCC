import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from '../usuario/usuario.module';
import { OfertaController } from './oferta.controller';
import { Oferta } from './oferta.entity';
import { OfertaService } from './oferta.service';

@Module({
  imports: [TypeOrmModule.forFeature([Oferta]), UsuarioModule],
  controllers: [OfertaController],
  providers: [OfertaService],
  exports: [OfertaService],
})
export class OfertaModule {}
