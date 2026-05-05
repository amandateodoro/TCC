import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProfissaoService } from '../profissao/profissao.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Contribuinte } from './contribuinte.entity';
import { CreateContribuinteDto } from './dto/create-contribuinte.dto';
import { UpdateContribuinteDto } from './dto/update-contribuinte.dto';

@Injectable()
export class ContribuinteService {
  constructor(
    @InjectRepository(Contribuinte)
    private readonly repository: Repository<Contribuinte>,
    private readonly profissoes: ProfissaoService,
    private readonly usuarios: UsuarioService,
  ) {}

  async create(dto: CreateContribuinteDto) {
    const contribuinte = this.repository.create(await this.toEntityPayload(dto));
    return this.repository.save(contribuinte);
  }

  findAll(search?: string) {
    return this.repository.find({
      where: search ? { nomeCompleto: Like(`%${search}%`) } : {},
      order: { nomeCompleto: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.findEntity(id);
  }

  async findEntity(id: number) {
    const contribuinte = await this.repository.findOneBy({ id });

    if (!contribuinte) {
      throw new NotFoundException('Contribuinte nao encontrado.');
    }

    return contribuinte;
  }

  async update(id: number, dto: UpdateContribuinteDto) {
    const contribuinte = await this.findEntity(id);
    Object.assign(contribuinte, await this.toEntityPayload(dto));
    return this.repository.save(contribuinte);
  }

  async remove(id: number) {
    const contribuinte = await this.findEntity(id);
    await this.repository.remove(contribuinte);
    return { deleted: true };
  }

  async birthdaysByMonth(month: number) {
    return this.repository
      .createQueryBuilder('contribuinte')
      .where('MONTH(contribuinte.data_de_nascimento) = :month', { month })
      .orderBy('DAY(contribuinte.data_de_nascimento)', 'ASC')
      .getMany();
  }

  private async toEntityPayload(dto: Partial<CreateContribuinteDto>) {
    const { profissaoId, profissaoNome, usuarioCadastroId, ...payload } = dto;

    return {
      ...payload,
      profissao: profissaoId
        ? await this.profissoes.findEntity(profissaoId)
        : await this.profissoes.findOrCreateByName(profissaoNome),
      usuarioCadastro: usuarioCadastroId ? await this.usuarios.findEntity(usuarioCadastroId) : undefined,
    };
  }
}
