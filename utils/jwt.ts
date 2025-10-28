import { create, verify, getNumericDate, type Header } from 'djwt';

const header: Header = { alg: 'HS256', typ: 'JWT' };

async function getKey() {
  const secret = Deno.env.get('JWT_SECRET') ?? 'dev-secret-change-me';
  return await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signJwt(payload: Record<string, unknown>) {
  const key = await getKey();
  const full = {
    ...payload,
    exp: getNumericDate(60 * 60 * 24 * 7) // 7 días
  };
  return await create(header, full, key);
}

export async function verifyJwt(token: string) {
  const key = await getKey();
  const data = await verify(token, key);
  return data as Record<string, unknown>;
}