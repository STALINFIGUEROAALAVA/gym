import { compare, hash } from 'bcrypt';

export async function hashPassword(password: string) {
  return await hash(password);
}

export async function verifyPassword(password: string, password_hash: string) {
  return await compare(password, password_hash);
}