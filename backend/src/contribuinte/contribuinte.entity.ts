import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contribuicao } from '../contribuicao/contribuicao.entity';
import { Profissao } from '../profissao/profissao.entity';

@Entity('contribuinte')
export class Contribuinte {
  @PrimaryGeneratedColumn({ name: 'id_contribuinte' })
  id: number;

  @Column({ name: 'nome_completo', length: 120 })
  nomeCompleto: string;

  @Column({ length: 180, nullable: true })
  endereco?: string;

  @Column({ length: 20, nullable: true })
  telefone?: string;

  @Column({ name: 'data_de_nascimento', type: 'date', nullable: true })
  dataDeNascimento?: string;

  @Column({ name: 'casado', default: false })
  casado: boolean;

  @OneToOne(() => Contribuinte, { nullable: true })
  @JoinColumn({ name: 'fk_id_conjuge' })
  conjuge?: Contribuinte | null;

  @ManyToMany(() => Profissao, (profissao) => profissao.contribuintes, {
    eager: true,
  })
  @JoinTable({
    name: 'profissao_contribuinte',
    joinColumn: { name: 'fk_id_contribuinte', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'fk_id_profissao', referencedColumnName: 'id' },
  })
  profissoes: Profissao[];

  @OneToMany(() => Contribuicao, (contribuicao) => contribuicao.contribuinte)
  contribuicoes: Contribuicao[];
}
