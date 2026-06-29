import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoriaDespesa } from '../categoria-despesa/categoria-despesa.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity('despesa')
export class Despesa {
  @PrimaryGeneratedColumn({ name: 'id_despesa' })
  id: number;

  @Column({ name: 'valor_despesa', type: 'decimal', precision: 10, scale: 2 })
  valorDespesa: string;

  @Column({ name: 'data_despesa', type: 'date' })
  dataDespesa: string;

  @Column({ name: 'descricao_despesa', length: 255, nullable: true })
  descricaoDespesa?: string;

  @ManyToOne(() => CategoriaDespesa, (categoria) => categoria.despesas, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'fk_id_categoria_despesa' })
  categoria?: CategoriaDespesa;

  @ManyToOne(() => Usuario, (usuario) => usuario.despesas, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'fk_id_usuario' })
  usuario: Usuario;
}
