import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfissaoDto } from './dto/create-profissao.dto';
import { UpdateProfissaoDto } from './dto/update-profissao.dto';
import { Profissao } from './profissao.entity';

@Injectable()
export class ProfissaoService {
  constructor(
    @InjectRepository(Profissao)
    private readonly repository: Repository<Profissao>,
  ) {}

  create(dto: CreateProfissaoDto) {
    return this.repository.save(this.repository.create(dto));
  }

  findAll() {
    return this.repository.find({ order: { nome: 'ASC' } });
  }

  async findEntity(id: number) {
    const profissao = await this.repository.findOneBy({ id });

    if (!profissao) {
      throw new NotFoundException('Profissao nao encontrada.');
    }

    return profissao;
  }

  async findOrCreateByName(nome?: string) {
    if (!nome) {
      return undefined;
    }

    const normalized = nome.trim();
    const existing = await this.repository.findOneBy({ nome: normalized });

    if (existing) {
      return existing;
    }

    return this.repository.save(this.repository.create({ nome: normalized }));
  }

  async update(id: number, dto: UpdateProfissaoDto) {
    const profissao = await this.findEntity(id);
    Object.assign(profissao, dto);
    return this.repository.save(profissao);
  }

  async remove(id: number) {
    const profissao = await this.findEntity(id);
    await this.repository.remove(profissao);
    return { deleted: true };
  }
}
