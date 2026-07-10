import { ensureDatabaseExists, getDatabaseConfig } from './database.config';

async function bootstrap() {
  const config = getDatabaseConfig();
  await ensureDatabaseExists(config);
  console.log(`Database "${config.database}" pronto.`);
}

void bootstrap();
