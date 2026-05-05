import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contribuinte } from '../contribuinte/contribuinte.entity';

@Entity('profissao_contribuinte')
export class Profissao {
  @PrimaryGeneratedColumn({ name: 'id_profissao_contribuinte' })
  id: number;

  @Column({ name: 'nome_profissao', length: 80, unique: true })
  nome: string;

  @OneToMany(() => Contribuinte, (contribuinte) => contribuinte.profissao)
  contribuintes: Contribuinte[];
}
