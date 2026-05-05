import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    await this.ensureUnique(dto.email, dto.nomeDeUsuario);
    const usuario = this.repository.create({
      ...dto,
      senha: await bcrypt.hash(dto.senha, 10),
    });

    return this.toResponse(await this.repository.save(usuario));
  }

  async findAll() {
    const usuarios = await this.repository.find({
      order: { nomeCompleto: 'ASC' },
    });

    return usuarios.map((usuario) => this.toResponse(usuario));
  }

  async findOne(id: number) {
    return this.toResponse(await this.findEntity(id));
  }

  async findEntity(id: number) {
    const usuario = await this.repository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.findEntity(id);

    if (dto.email || dto.nomeDeUsuario) {
      await this.ensureUnique(dto.email ?? usuario.email, dto.nomeDeUsuario ?? usuario.nomeDeUsuario, id);
    }

    Object.assign(usuario, dto);

    if (dto.senha) {
      usuario.senha = await bcrypt.hash(dto.senha, 10);
    }

    return this.toResponse(await this.repository.save(usuario));
  }

  async remove(id: number) {
    const usuario = await this.findEntity(id);
    await this.repository.remove(usuario);
    return { deleted: true };
  }

  async validateLogin(nomeDeUsuario: string, senha: string) {
    const usuario = await this.repository
      .createQueryBuilder('usuario')
      .addSelect('usuario.senha')
      .where('usuario.nome_de_usuario = :nomeDeUsuario', { nomeDeUsuario })
      .getOne();

    if (!usuario) {
      return null;
    }

    const valid = await bcrypt.compare(senha, usuario.senha);
    return valid ? this.toResponse(usuario) : null;
  }

  private async ensureUnique(email: string, nomeDeUsuario: string, ignoreId?: number) {
    const existing = await this.repository.findOne({
      where: [{ email }, { nomeDeUsuario }],
    });

    if (existing && existing.id !== ignoreId) {
      throw new ConflictException('E-mail ou nome de usuario ja cadastrado.');
    }
  }

  private toResponse(usuario: Usuario) {
    const { senha, ...safeUsuario } = usuario;
    void senha;
    return safeUsuario;
  }
}
