import { createConnection } from 'mysql2/promise';

type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

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
