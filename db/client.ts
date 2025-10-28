import { Pool } from 'postgres';

const DATABASE_URL = Deno.env.get('DATABASE_URL');
if (!DATABASE_URL) {
  console.error('Falta la variable de entorno DATABASE_URL');
  Deno.exit(1);
}

// Tamaño de pool: ajusta según tu despliegue
export const pool = new Pool(DATABASE_URL, 5, true);

export async function queryObject<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.queryObject<T>(sql, params);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await queryObject<T>(sql, params);
  return rows[0] ?? null;
}

export async function queryValue<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
  const row = await queryOne<{ value: T }>(`SELECT (${sql}) as value`, params);
  return (row?.value ?? null) as T | null;
}