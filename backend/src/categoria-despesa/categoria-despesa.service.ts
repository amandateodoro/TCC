import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaDespesa } from './categoria-despesa.entity';

@Injectable()
export class CategoriaDespesaService {
  constructor(
    @InjectRepository(CategoriaDespesa)
    private readonly repository: Repository<CategoriaDespesa>,
  ) {}

  findAll() {
    return this.repository.find({ order: { nome: 'ASC' } });
  }

  async findEntity(id: number) {
    const categoria = await this.repository.findOneBy({ id });

    if (!categoria) {
      throw new NotFoundException('Categoria de despesa nao encontrada.');
    }

    return categoria;
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
}
