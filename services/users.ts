import { queryOne } from '../db/client.ts';

type CreateUser = {
  email: string;
  password_hash: string;
  role: string;
};

export async function getUserByEmail(email: string) {
  return await queryOne<{ id: number; email: string; password_hash: string; role: string }>(
    'SELECT id, email, password_hash, role FROM users WHERE email = $1',
    [email]
  );
}

export async function createUser(input: CreateUser) {
  const row = await queryOne<{ id: number }>(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
    [input.email, input.password_hash, input.role]
  );
  return row;
}