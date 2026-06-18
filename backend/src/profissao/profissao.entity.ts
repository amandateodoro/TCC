import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contribuinte } from '../contribuinte/contribuinte.entity';

@Entity('profissao')
export class Profissao {
  @PrimaryGeneratedColumn({ name: 'id_profissao' })
  id: number;

  @Column({ name: 'nome_profissao', length: 255 })
  nome: string;

  @Column({
    name: 'codigo_cbo',
    type: 'varchar',
    length: 10,
    nullable: true,
    unique: true,
  })
  codigoCbo?: string | null;

  @ManyToMany(() => Contribuinte, (contribuinte) => contribuinte.profissoes)
  contribuintes: Contribuinte[];
}
