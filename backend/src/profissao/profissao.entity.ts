import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contribuinte } from '../contribuinte/contribuinte.entity';

@Entity('profissao')
@Index('IDX_profissao_nome', ['nome'])
export class Profissao {
  @PrimaryGeneratedColumn({ name: 'id_profissao' })
  id: number;

  @Column({ name: 'nome_profissao', length: 255 })
  nome: string;

  @Column({
    name: 'codigo_cbo',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  codigoCbo: string;

  @ManyToMany(() => Contribuinte, (contribuinte) => contribuinte.profissoes)
  contribuintes: Contribuinte[];
}
