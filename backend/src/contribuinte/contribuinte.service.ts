import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { Profissao } from '../profissao/profissao.entity';
import { Contribuinte } from './contribuinte.entity';
import { CreateContribuinteDto } from './dto/create-contribuinte.dto';
import { UpdateContribuinteDto } from './dto/update-contribuinte.dto';

@Injectable()
export class ContribuinteService {
  constructor(
    @InjectRepository(Contribuinte)
    private readonly repository: Repository<Contribuinte>,
    private readonly dataSource: DataSource,
  ) {}

  create(dto: CreateContribuinteDto) {
    return this.dataSource.transaction(async (manager) => {
      if (dto.casado) {
        this.assertSpouseData(dto);
      }

      const repository = manager.getRepository(Contribuinte);
      const contribuinte = repository.create({
        ...this.getContributorFields(dto),
        casado: dto.casado ?? false,
        profissoes: await this.findProfessions(manager, dto.profissaoIds),
      });

      await repository.save(contribuinte);

      if (dto.casado) {
        const conjuge = repository.create({
          nomeCompleto: dto.nomeConjuge!,
          endereco: dto.endereco,
          telefone: dto.telefoneConjuge!,
          dataDeNascimento: dto.dataNascimentoConjuge!,
          casado: true,
          profissoes: await this.findProfessions(
            manager,
            dto.profissaoConjugeIds!,
          ),
        });

        await repository.save(conjuge);
        contribuinte.conjuge = conjuge;
        conjuge.conjuge = contribuinte;
        await repository.save([contribuinte, conjuge]);
      }

      return this.findWithSpouse(repository, contribuinte.id);
    });
  }

  findAll(search?: string) {
    return this.repository.find({
      where: search ? { nomeCompleto: Like(`%${search}%`) } : {},
      relations: { profissoes: true, conjuge: { profissoes: true } },
      order: { nomeCompleto: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.findWithSpouse(this.repository, id);
  }

  async findEntity(id: number) {
    return this.findWithSpouse(this.repository, id);
  }

  update(id: number, dto: UpdateContribuinteDto) {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Contribuinte);
      const contribuinte = await repository.findOne({
        where: { id },
        relations: { conjuge: true },
      });

      if (!contribuinte) {
        throw new NotFoundException('Contribuinte nao encontrado.');
      }

      Object.assign(contribuinte, this.getContributorFields(dto));

      if (dto.profissaoIds !== undefined) {
        contribuinte.profissoes = await this.findProfessions(
          manager,
          dto.profissaoIds,
        );
      }

      const shouldBeMarried = dto.casado ?? contribuinte.casado;

      if (shouldBeMarried) {
        if (!contribuinte.conjuge) {
          this.assertSpouseData(dto);
          contribuinte.conjuge = repository.create({
            nomeCompleto: dto.nomeConjuge!,
            endereco: dto.endereco ?? contribuinte.endereco,
            telefone: dto.telefoneConjuge!,
            dataDeNascimento: dto.dataNascimentoConjuge!,
            casado: true,
            profissoes: await this.findProfessions(
              manager,
              dto.profissaoConjugeIds!,
            ),
          });
          await repository.save(contribuinte.conjuge);
        } else {
          if (dto.nomeConjuge !== undefined) {
            contribuinte.conjuge.nomeCompleto = dto.nomeConjuge;
          }
          if (dto.telefoneConjuge !== undefined) {
            contribuinte.conjuge.telefone = dto.telefoneConjuge;
          }
          if (dto.dataNascimentoConjuge !== undefined) {
            contribuinte.conjuge.dataDeNascimento = dto.dataNascimentoConjuge;
          }
          if (dto.profissaoConjugeIds !== undefined) {
            contribuinte.conjuge.profissoes = await this.findProfessions(
              manager,
              dto.profissaoConjugeIds,
            );
          }
        }

        contribuinte.casado = true;
        contribuinte.conjuge.casado = true;
        contribuinte.conjuge.conjuge = contribuinte;
        await repository.save([contribuinte, contribuinte.conjuge]);
      } else {
        const conjuge = contribuinte.conjuge;
        contribuinte.casado = false;
        contribuinte.conjuge = null;

        if (conjuge) {
          conjuge.casado = false;
          conjuge.conjuge = null;
          await repository.save(conjuge);
        }

        await repository.save(contribuinte);
      }

      return this.findWithSpouse(repository, contribuinte.id);
    });
  }

  remove(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Contribuinte);
      const contribuinte = await repository.findOne({
        where: { id },
        relations: { conjuge: true },
      });

      if (!contribuinte) {
        throw new NotFoundException('Contribuinte nao encontrado.');
      }

      if (contribuinte.conjuge) {
        contribuinte.conjuge.casado = false;
        contribuinte.conjuge.conjuge = null;
        await repository.save(contribuinte.conjuge);
      }

      await repository.remove(contribuinte);
      return { deleted: true };
    });
  }

  birthdaysByMonth(month: number) {
    return this.repository
      .createQueryBuilder('contribuinte')
      .where('MONTH(contribuinte.data_de_nascimento) = :month', { month })
      .orderBy('DAY(contribuinte.data_de_nascimento)', 'ASC')
      .getMany();
  }

  private async findWithSpouse(repository: Repository<Contribuinte>, id: number) {
    const contribuinte = await repository.findOne({
      where: { id },
      relations: { profissoes: true, conjuge: { profissoes: true } },
    });

    if (!contribuinte) {
      throw new NotFoundException('Contribuinte nao encontrado.');
    }

    return contribuinte;
  }

  private getContributorFields(dto: Partial<CreateContribuinteDto>) {
    const fields = {
      nomeCompleto: dto.nomeCompleto,
      endereco: dto.endereco,
      telefone: dto.telefone,
      dataDeNascimento: dto.dataDeNascimento,
    };

    return Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    );
  }

  private async findProfessions(manager: EntityManager, ids: number[]) {
    if (!ids?.length) {
      throw new BadRequestException('Informe ao menos uma profissao.');
    }

    const professions = await Promise.all(
      [...new Set(ids)].map(async (id) => {
        const profession = await manager
          .getRepository(Profissao)
          .findOneBy({ id });

        if (!profession) {
          throw new NotFoundException(`Profissao ${id} nao encontrada.`);
        }

        return profession;
      }),
    );

    return professions;
  }

  private assertSpouseData(dto: Partial<CreateContribuinteDto>) {
    if (
      !dto.nomeConjuge?.trim() ||
      !dto.telefoneConjuge?.trim() ||
      !dto.dataNascimentoConjuge ||
      !dto.profissaoConjugeIds?.length
    ) {
      throw new BadRequestException(
        'Nome, telefone, data de nascimento e profissao do conjuge sao obrigatorios para contribuintes casados.',
      );
    }
  }
}
