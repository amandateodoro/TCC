import { createConnection } from 'mysql2/promise';

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export function getDatabaseConfig(config?: {
  get<T = string>(key: string, defaultValue: T): T;
}): DatabaseConfig {
  return {
    host: config?.get<string>('DB_HOST', 'localhost') ?? process.env.DB_HOST ?? 'localhost',
    port: Number(config?.get<number>('DB_PORT', 3306) ?? process.env.DB_PORT ?? 3306),
    username: config?.get<string>('DB_USER', 'root') ?? process.env.DB_USER ?? 'root',
    password: config?.get<string>('DB_PASSWORD', 'root') ?? process.env.DB_PASSWORD ?? 'root',
    database: config?.get<string>('DB_NAME', 'tcc') ?? process.env.DB_NAME ?? 'tcc',
  };
}

export async function ensureDatabaseExists(config: DatabaseConfig) {
  const connection = await createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await connection.end();
  }
}
