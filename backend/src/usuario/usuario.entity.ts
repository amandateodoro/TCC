import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contribuicao } from '../contribuicao/contribuicao.entity';
import { Despesa } from '../despesa/despesa.entity';
import { Oferta } from '../oferta/oferta.entity';

export enum NivelAcesso {
  ADMINISTRADOR = 'Administrador',
  SECRETARIA = 'Secretaria',
}

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;

  @Column({ name: 'nome_completo', length: 120 })
  nomeCompleto: string;

  @Column({ name: 'nome_de_usuario', length: 60, unique: true })
  nomeDeUsuario: string;

  @Column({ name: 'senha', length: 120, select: false })
  senha: string;

  @Column({ length: 120, unique: true })
  email: string;

  @Column({
    name: 'nivel_acesso',
    type: 'enum',
    enum: NivelAcesso,
    default: NivelAcesso.SECRETARIA,
  })
  nivelAcesso: NivelAcesso;

  @Column({ length: 20, nullable: true })
  telefone?: string;

  @OneToMany(() => Contribuicao, (contribuicao) => contribuicao.usuarioCadastro)
  contribuicoesCadastradas: Contribuicao[];

  @OneToMany(() => Oferta, (oferta) => oferta.usuarioCadastro)
  ofertasCadastradas: Oferta[];

  @OneToMany(() => Despesa, (despesa) => despesa.usuario)
  despesas: Despesa[];
}
