import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Profissao } from './profissao.entity';

@Injectable()
export class ProfissaoService {
  constructor(
    @InjectRepository(Profissao)
    private readonly repository: Repository<Profissao>,
  ) {}

  findAll(search?: string, limit = 20) {
    const query = this.repository
      .createQueryBuilder('profissao')
      .orderBy('profissao.nome', 'ASC')
      .take(Math.min(Math.max(limit, 1), 100));

    if (search?.trim()) {
      query.where(
        new Brackets((builder) => {
          builder
            .where('profissao.nome LIKE :search', {
              search: `%${search.trim()}%`,
            })
            .orWhere('profissao.codigo_cbo LIKE :search', {
              search: `%${search.trim()}%`,
            });
        }),
      );
    }

    return query.getMany();
  }

}
