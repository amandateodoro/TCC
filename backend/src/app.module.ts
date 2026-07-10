import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
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
import { ensureDatabaseExists, getDatabaseConfig } from './database/database.config';
import { JwtAuthGuard } from './auth/auth.jwt';
import { RolesGuard } from './auth/auth.roles';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const databaseConfig = getDatabaseConfig(config);

        await ensureDatabaseExists(databaseConfig);

        return {
          type: 'mysql',
          ...databaseConfig,
          autoLoadEntities: true,
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
