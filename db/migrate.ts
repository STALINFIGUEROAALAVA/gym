// Script simple de migraciones: aplica archivos .sql en orden por nombre.
import { expandGlob } from 'std/fs/mod.ts';
import { resolve } from 'std/path/mod.ts';
import { pool } from './client.ts';

type Direction = 'up' | 'down';
const direction = (Deno.args[0] as Direction) || 'up';

const migrationsDir = resolve(Deno.cwd(), 'db', 'migrations');

const client = await pool.connect();
try {
  await client.queryArray(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const entries: string[] = [];
  for await (const f of expandGlob(`${migrationsDir}/**/*.sql`)) {
    if (f.isFile) entries.push(f.path);
  }
  entries.sort();

  if (direction === 'up') {
    for (const path of entries) {
      const name = path.split('/').pop()!;
      const exists = await client.queryObject<{ count: number }>(
        'SELECT COUNT(*)::int as count FROM migrations WHERE name = $1',
        [name]
      );
      const applied = exists.rows[0].count > 0;
      if (applied) continue;

      const sql = await Deno.readTextFile(path);
      console.log(`Aplicando: ${name}`);
      await client.queryArray('BEGIN');
      try {
        await client.queryArray(sql);
        await client.queryArray('INSERT INTO migrations (name) VALUES ($1)', [name]);
        await client.queryArray('COMMIT');
      } catch (e) {
        await client.queryArray('ROLLBACK');
        console.error(`Error en ${name}:`, e);
        Deno.exit(1);
      }
    }
  } else {
    // down: revierte en orden inverso si defines archivos *_down.sql (opcional)
    console.log('No implementado: down. Elimina a mano o agrega archivos down.');
  }
} finally {
  client.release();
  Deno.exit(0);
}