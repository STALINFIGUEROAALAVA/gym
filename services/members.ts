import { queryObject, queryOne } from '../db/client.ts';

type MemberInput = {
  full_name: string;
  email: string | null;
  phone: string | null;
};

export async function listMembers() {
  return await queryObject<{
    id: number;
    full_name: string;
    email: string | null;
    phone: string | null;
    created_at: string;
  }>('SELECT id, full_name, email, phone, created_at FROM members ORDER BY id DESC');
}

export async function createMember(input: MemberInput) {
  return await queryOne<{ id: number; full_name: string; email: string | null; phone: string | null }>(
    'INSERT INTO members (full_name, email, phone) VALUES ($1, $2, $3) RETURNING id, full_name, email, phone',
    [input.full_name, input.email, input.phone]
  );
}

export async function getMember(id: number) {
  return await queryOne<{ id: number; full_name: string; email: string | null; phone: string | null; created_at: string }>(
    'SELECT id, full_name, email, phone, created_at FROM members WHERE id = $1',
    [id]
  );
}

export async function updateMember(id: number, input: MemberInput) {
  await queryOne(
    'UPDATE members SET full_name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id',
    [input.full_name, input.email, input.phone, id]
  );
}

export async function deleteMember(id: number) {
  await queryOne('DELETE FROM members WHERE id = $1 RETURNING id', [id]);
}