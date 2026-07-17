import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CategoriaDespesaService } from '../categoria-despesa/categoria-despesa.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Despesa } from './despesa.entity';
import { CreateDespesaDto } from './dto/create-despesa.dto';

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
export class DespesaService {
  constructor(
    @InjectRepository(Despesa)
    private readonly repository: Repository<Despesa>,
    private readonly categorias: CategoriaDespesaService,
    private readonly usuarios: UsuarioService,
  ) {}

  async create(dto: CreateDespesaDto) {
    const despesa = this.repository.create(await this.toEntityPayload(dto));
    return this.repository.save(despesa);
  }

  findAll(inicio?: string, fim?: string) {
    return this.repository.find({
      where: inicio && fim ? { dataDespesa: Between(inicio, fim) } : {},
      order: { dataDespesa: 'DESC' },
    });
  }

  sumByMonth(year: number, month: number) {
    return this.repository
      .createQueryBuilder('despesa')
      .select('COALESCE(SUM(despesa.valor_despesa), 0)', 'total')
      .where('YEAR(despesa.data_despesa) = :year', { year })
      .andWhere('MONTH(despesa.data_despesa) = :month', { month })
      .getRawOne<{ total: string }>();
  }

  sumByPeriod(inicio?: string, fim?: string) {
    const query = this.repository
      .createQueryBuilder('despesa')
      .select('COALESCE(SUM(despesa.valor_despesa), 0)', 'total');

    if (inicio && fim) {
      query.where('despesa.data_despesa BETWEEN :inicio AND :fim', { inicio, fim });
    }

    return query.getRawOne<{ total: string }>();
  }

  private async toEntityPayload(dto: Partial<CreateDespesaDto>) {
    const { categoriaId, categoriaNome, usuarioId, valorDespesa, ...payload } = dto;
    assertNotFutureDate(payload.dataDespesa, 'A data da despesa');

    return {
      ...payload,
      valorDespesa: valorDespesa ? parseMoney(valorDespesa) : undefined,
      categoria: categoriaId
        ? await this.categorias.findEntity(categoriaId)
        : await this.categorias.findOrCreateByName(categoriaNome),
      usuario: usuarioId ? await this.usuarios.findEntity(usuarioId) : undefined,
    };
  }
}
