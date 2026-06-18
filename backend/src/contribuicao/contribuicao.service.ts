import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { parseMoney } from '../common/parse-money';
import { ContribuinteService } from '../contribuinte/contribuinte.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Contribuicao } from './contribuicao.entity';
import { CreateContribuicaoDto } from './dto/create-contribuicao.dto';
import { UpdateContribuicaoDto } from './dto/update-contribuicao.dto';

@Injectable()
export class ContribuicaoService {
  constructor(
    @InjectRepository(Contribuicao)
    private readonly repository: Repository<Contribuicao>,
    private readonly contribuintes: ContribuinteService,
    private readonly usuarios: UsuarioService,
  ) {}

  async create(dto: CreateContribuicaoDto) {
    const contribuicao = this.repository.create(await this.toEntityPayload(dto));
    return this.repository.save(contribuicao);
  }

  findAll(inicio?: string, fim?: string) {
    return this.repository.find({
      where: inicio && fim ? { dataDePagamento: Between(inicio, fim) } : {},
      order: { dataDePagamento: 'DESC' },
    });
  }

  async findEntity(id: number) {
    const contribuicao = await this.repository.findOneBy({ id });

    if (!contribuicao) {
      throw new NotFoundException('Contribuicao nao encontrada.');
    }

    return contribuicao;
  }

  async update(id: number, dto: UpdateContribuicaoDto) {
    const contribuicao = await this.findEntity(id);
    Object.assign(contribuicao, await this.toEntityPayload(dto));
    return this.repository.save(contribuicao);
  }

  async remove(id: number) {
    const contribuicao = await this.findEntity(id);
    await this.repository.remove(contribuicao);
    return { deleted: true };
  }

  sumByMonth(year: number, month: number) {
    return this.repository
      .createQueryBuilder('contribuicao')
      .select('COALESCE(SUM(contribuicao.valor_contribuicao), 0)', 'total')
      .where('YEAR(contribuicao.data_de_pagamento) = :year', { year })
      .andWhere('MONTH(contribuicao.data_de_pagamento) = :month', { month })
      .getRawOne<{ total: string }>();
  }

  private async toEntityPayload(dto: Partial<CreateContribuicaoDto>) {
    const { contribuinteId, usuarioCadastroId, valorContribuicao, ...payload } = dto;

    return {
      ...payload,
      valorContribuicao: valorContribuicao ? parseMoney(valorContribuicao) : undefined,
      usuarioCadastro: usuarioCadastroId ? await this.usuarios.findEntity(usuarioCadastroId) : undefined,
      contribuinte: contribuinteId
        ? await this.contribuintes.findEntity(contribuinteId)
        : undefined,
    };
  }
}
