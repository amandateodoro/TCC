import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoriaDespesaModule } from './categoria-despesa/categoria-despesa.module';
import { ContribuicaoModule } from './contribuicao/contribuicao.module';
import { ContribuinteModule } from './contribuinte/contribuinte.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DespesaModule } from './despesa/despesa.module';
import { OfertaModule } from './oferta/oferta.module';
import { ProfissaoModule } from './profissao/profissao.module';
import { RelatorioModule } from './relatorio/relatorio.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ensureDatabaseExists } from './database/ensure-database';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const databaseConfig = {
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 3306),
          username: config.get<string>('DB_USER', 'root'),
          password: config.get<string>('DB_PASSWORD', 'root'),
          database: config.get<string>('DB_NAME', 'tcc'),
        };

        await ensureDatabaseExists(databaseConfig);

        return {
          type: 'mysql',
          ...databaseConfig,
          autoLoadEntities: true,
          migrationsRun: config.get<string>('DB_MIGRATIONS_RUN', 'false') === 'true',
          synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
        };
      },
    }),
    UsuarioModule,
    ProfissaoModule,
    ContribuinteModule,
    ContribuicaoModule,
    CategoriaDespesaModule,
    DespesaModule,
    OfertaModule,
    DashboardModule,
    RelatorioModule,
    AuthModule,
  ],
})
export class AppModule {}
