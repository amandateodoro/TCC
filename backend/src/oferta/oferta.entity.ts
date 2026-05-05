import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('oferta')
export class Oferta {
  @PrimaryGeneratedColumn({ name: 'id_oferta' })
  id: number;

  @Column({ name: 'tipo_celebracao', length: 80 })
  tipoCelebracao: string;

  @Column({ name: 'valor_total', type: 'decimal', precision: 10, scale: 2 })
  valorTotal: string;

  @Column({ name: 'data_oferta', type: 'date' })
  dataOferta: string;

  @Column({ length: 255, nullable: true })
  observacao?: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.ofertasCadastradas, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'fk_id_usuario' })
  usuarioCadastro?: Usuario;
}
