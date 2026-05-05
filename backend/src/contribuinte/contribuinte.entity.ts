import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contribuicao } from '../contribuicao/contribuicao.entity';
import { Profissao } from '../profissao/profissao.entity';
import { Usuario } from '../usuario/usuario.entity';

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

  @Column({ name: 'nome_conjuge', length: 120, nullable: true })
  nomeConjuge?: string;

  @Column({ name: 'telefone_conjuge', length: 20, nullable: true })
  telefoneConjuge?: string;

  @Column({ name: 'data_nascimento_conjuge', type: 'date', nullable: true })
  dataNascimentoConjuge?: string;

  @ManyToOne(() => Profissao, (profissao) => profissao.contribuintes, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'fk_id_profissao_contribuinte' })
  profissao?: Profissao;

  @ManyToOne(() => Usuario, (usuario) => usuario.contribuintesCadastrados, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'fk_id_usuario' })
  usuarioCadastro?: Usuario;

  @ManyToMany(() => Contribuicao, (contribuicao) => contribuicao.contribuintes)
  contribuicoes: Contribuicao[];
}
