import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ContribuinteService } from '../contribuinte/contribuinte.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Contribuicao } from './contribuicao.entity';
import { CreateContribuicaoDto } from './dto/create-contribuicao.dto';

function parseMoney(value: string | number): string {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }

  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) {
    return '0.00';
  }

  return parsed.toFixed(2);
}

function assertNotFutureDate(date: string | undefined, fieldLabel: string) {
  const today = new Date().toISOString().slice(0, 10);

  if (date && date > today) {
    throw new BadRequestException(`${fieldLabel} nao pode ser uma data futura.`);
  }
}

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

  sumByMonth(year: number, month: number) {
    return this.repository
      .createQueryBuilder('contribuicao')
      .select('COALESCE(SUM(contribuicao.valor_contribuicao), 0)', 'total')
      .where('YEAR(contribuicao.data_de_pagamento) = :year', { year })
      .andWhere('MONTH(contribuicao.data_de_pagamento) = :month', { month })
      .getRawOne<{ total: string }>();
  }

  sumByPeriod(inicio?: string, fim?: string) {
    const query = this.repository
      .createQueryBuilder('contribuicao')
      .select('COALESCE(SUM(contribuicao.valor_contribuicao), 0)', 'total');

    if (inicio && fim) {
      query.where('contribuicao.data_de_pagamento BETWEEN :inicio AND :fim', { inicio, fim });
    }

    return query.getRawOne<{ total: string }>();
  }

  private async toEntityPayload(dto: Partial<CreateContribuicaoDto>) {
    const { contribuinteId, usuarioCadastroId, valorContribuicao, ...payload } = dto;
    assertNotFutureDate(payload.dataDePagamento, 'A data de pagamento');

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
