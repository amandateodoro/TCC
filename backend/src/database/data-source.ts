import { DataSource } from 'typeorm';
import { CategoriaDespesa } from '../categoria-despesa/categoria-despesa.entity';
import { Contribuicao } from '../contribuicao/contribuicao.entity';
import { Contribuinte } from '../contribuinte/contribuinte.entity';
import { Despesa } from '../despesa/despesa.entity';
import { Oferta } from '../oferta/oferta.entity';
import { Profissao } from '../profissao/profissao.entity';
import { Usuario } from '../usuario/usuario.entity';
import { loadDatabaseEnv } from './env';

const databaseConfig = loadDatabaseEnv();

export default new DataSource({
  type: 'mysql',
  ...databaseConfig,
  entities: [Usuario, Profissao, Contribuinte, Contribuicao, CategoriaDespesa, Despesa, Oferta],
  synchronize: false,
});
