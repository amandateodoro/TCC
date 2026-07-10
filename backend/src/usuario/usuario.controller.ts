import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser, Roles } from '../auth/auth.roles';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { NivelAcesso } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @Get('perfil')
  findMe(@Req() request: { user: AuthUser }) {
    return this.service.findOne(request.user.id);
  }

  @Patch('perfil')
  updateMe(
    @Req() request: { user: AuthUser },
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.service.updateOwnProfile(request.user.id, dto);
  }

  @Roles(NivelAcesso.ADMINISTRADOR)
  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.service.create(dto);
  }

  @Roles(NivelAcesso.ADMINISTRADOR)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles(NivelAcesso.ADMINISTRADOR)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(NivelAcesso.ADMINISTRADOR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    return this.service.update(id, dto);
  }

  @Roles(NivelAcesso.ADMINISTRADOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
