import { Module } from '@nestjs/common';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsuarioModule],
  controllers: [AuthController],
})
export class AuthModule {}
