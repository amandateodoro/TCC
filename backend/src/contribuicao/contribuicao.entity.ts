import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contribuinte } from '../contribuinte/contribuinte.entity';
import { Usuario } from '../usuario/usuario.entity';

export enum TipoContribuicao {
  DIZIMO = 'Dizimo',
  CONTRIBUICAO_VOLUNTARIA = 'Contribuicao voluntaria',
}

@Entity('contribuicao')
export class Contribuicao {
  @PrimaryGeneratedColumn({ name: 'id_contribuicao' })
  id: number;

  @Column({ name: 'tipo_contribuicao', length: 60 })
  tipoContribuicao: string;

  @Column({ name: 'valor_contribuicao', type: 'decimal', precision: 10, scale: 2 })
  valorContribuicao: string;

  @Column({ name: 'forma_de_pagamento', length: 45 })
  formaDePagamento: string;

  @Column({ name: 'data_de_pagamento', type: 'date' })
  dataDePagamento: string;

  @Column({ length: 255, nullable: true })
  observacao?: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.contribuicoesCadastradas, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'fk_id_usuario' })
  usuarioCadastro?: Usuario;

  @ManyToOne(() => Contribuinte, (contribuinte) => contribuinte.contribuicoes, {
    eager: true,
  })
  @JoinColumn({ name: 'fk_id_contribuinte' })
  contribuinte: Contribuinte;
}
