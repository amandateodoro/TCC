import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CategoriaDespesaService } from '../categoria-despesa/categoria-despesa.service';
import { parseMoney } from '../common/parse-money';
import { UsuarioService } from '../usuario/usuario.service';
import { Despesa } from './despesa.entity';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

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

  async findEntity(id: number) {
    const despesa = await this.repository.findOneBy({ id });

    if (!despesa) {
      throw new NotFoundException('Despesa nao encontrada.');
    }

    return despesa;
  }

  async update(id: number, dto: UpdateDespesaDto) {
    const despesa = await this.findEntity(id);
    Object.assign(despesa, await this.toEntityPayload(dto));
    return this.repository.save(despesa);
  }

  async remove(id: number) {
    const despesa = await this.findEntity(id);
    await this.repository.remove(despesa);
    return { deleted: true };
  }

  sumByMonth(year: number, month: number) {
    return this.repository
      .createQueryBuilder('despesa')
      .select('COALESCE(SUM(despesa.valor_despesa), 0)', 'total')
      .where('YEAR(despesa.data_despesa) = :year', { year })
      .andWhere('MONTH(despesa.data_despesa) = :month', { month })
      .getRawOne<{ total: string }>();
  }

  private async toEntityPayload(dto: Partial<CreateDespesaDto>) {
    const { categoriaId, categoriaNome, usuarioIds, valorDespesa, ...payload } = dto;

    return {
      ...payload,
      valorDespesa: valorDespesa ? parseMoney(valorDespesa) : undefined,
      categoria: categoriaId
        ? await this.categorias.findEntity(categoriaId)
        : await this.categorias.findOrCreateByName(categoriaNome),
      usuarios: usuarioIds ? await Promise.all(usuarioIds.map((id) => this.usuarios.findEntity(id))) : undefined,
    };
  }
}
