import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contribuicao } from '../contribuicao/contribuicao.entity';
import { Contribuinte } from '../contribuinte/contribuinte.entity';
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

  @OneToMany(() => Contribuinte, (contribuinte) => contribuinte.usuarioCadastro)
  contribuintesCadastrados: Contribuinte[];

  @OneToMany(() => Contribuicao, (contribuicao) => contribuicao.usuarioCadastro)
  contribuicoesCadastradas: Contribuicao[];

  @OneToMany(() => Oferta, (oferta) => oferta.usuarioCadastro)
  ofertasCadastradas: Oferta[];

  @ManyToMany(() => Despesa, (despesa) => despesa.usuarios)
  despesas: Despesa[];
}
