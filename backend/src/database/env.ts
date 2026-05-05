import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

export type DatabaseEnv = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export function loadDatabaseEnv(): DatabaseEnv {
  const fileEnv = readEnvFile(resolve(process.cwd(), '.env'));

  return {
    host: process.env.DB_HOST ?? fileEnv.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? fileEnv.DB_PORT ?? 3306),
    username: process.env.DB_USER ?? fileEnv.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? fileEnv.DB_PASSWORD ?? 'root',
    database: process.env.DB_NAME ?? fileEnv.DB_NAME ?? 'tcc',
  };
}

function readEnvFile(path: string) {
  if (!existsSync(path)) {
    return {};
  }

  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce<Record<string, string>>((env, line) => {
      const separatorIndex = line.indexOf('=');
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = value;
      return env;
    }, {});
}
