import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Despesa } from '../despesa/despesa.entity';

@Entity('categoria_despesa')
export class CategoriaDespesa {
  @PrimaryGeneratedColumn({ name: 'id_categoria_despesa' })
  id: number;

  @Column({ name: 'nome_categoria', length: 80, unique: true })
  nome: string;

  @OneToMany(() => Despesa, (despesa) => despesa.categoria)
  despesas: Despesa[];
}
