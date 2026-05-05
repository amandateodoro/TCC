import { ensureDatabaseExists } from './ensure-database';
import { loadDatabaseEnv } from './env';

async function bootstrap() {
  const config = loadDatabaseEnv();
  await ensureDatabaseExists(config);
  console.log(`Database "${config.database}" pronto.`);
}

void bootstrap();
