import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';
import { Oferta } from './oferta.entity';

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
export class OfertaService {
  constructor(
    @InjectRepository(Oferta)
    private readonly repository: Repository<Oferta>,
    private readonly usuarios: UsuarioService,
  ) {}

  async create(dto: CreateOfertaDto) {
    const oferta = this.repository.create(await this.toEntityPayload(dto));
    return this.repository.save(oferta);
  }

  findAll(inicio?: string, fim?: string) {
    return this.repository.find({
      where: inicio && fim ? { dataOferta: Between(inicio, fim) } : {},
      order: { dataOferta: 'DESC' },
    });
  }

  async findEntity(id: number) {
    const oferta = await this.repository.findOneBy({ id });

    if (!oferta) {
      throw new NotFoundException('Oferta nao encontrada.');
    }

    return oferta;
  }

  async update(id: number, dto: UpdateOfertaDto) {
    const oferta = await this.findEntity(id);
    Object.assign(oferta, await this.toEntityPayload(dto));
    return this.repository.save(oferta);
  }

  async remove(id: number) {
    const oferta = await this.findEntity(id);
    await this.repository.remove(oferta);
    return { deleted: true };
  }

  sumByMonth(year: number, month: number) {
    return this.repository
      .createQueryBuilder('oferta')
      .select('COALESCE(SUM(oferta.valor_total), 0)', 'total')
      .where('YEAR(oferta.data_oferta) = :year', { year })
      .andWhere('MONTH(oferta.data_oferta) = :month', { month })
      .getRawOne<{ total: string }>();
  }

  sumByPeriod(inicio?: string, fim?: string) {
    const query = this.repository
      .createQueryBuilder('oferta')
      .select('COALESCE(SUM(oferta.valor_total), 0)', 'total');

    if (inicio && fim) {
      query.where('oferta.data_oferta BETWEEN :inicio AND :fim', { inicio, fim });
    }

    return query.getRawOne<{ total: string }>();
  }

  private async toEntityPayload(dto: Partial<CreateOfertaDto>) {
    const { usuarioCadastroId, valorTotal, ...payload } = dto;
    assertNotFutureDate(payload.dataOferta, 'A data da oferta');

    return {
      ...payload,
      valorTotal: valorTotal ? parseMoney(valorTotal) : undefined,
      usuarioCadastro: usuarioCadastroId ? await this.usuarios.findEntity(usuarioCadastroId) : undefined,
    };
  }
}
