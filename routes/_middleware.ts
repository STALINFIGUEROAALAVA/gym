import { MiddlewareHandlerContext } from '$fresh/server.ts';
import { getCookies } from 'std/http/cookie.ts';
import { verifyJwt } from '../utils/jwt.ts';

const PUBLIC_PATHS = [
  /^\/$,
  /^\/auth\/login/,
  /^\/auth\/register/,
  /^\/static\//,
  /^\/styles\.css$/
];

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<{ currentUser?: { id: number; email: string; role: string } }>
) {
  const url = new URL(req.url);
  const path = url.pathname;

  const cookies = getCookies(req.headers);
  const token = cookies['auth'] ?? '';

  if (token) {
    const payload = await verifyJwt(token).catch(() => null);
    if (payload) {
      ctx.state.currentUser = {
        id: payload.uid as number,
        email: payload.email as string,
        role: payload.role as string
      };
    }
  }

  const isPublic = PUBLIC_PATHS.some((r) => r.test(path));

  if (!isPublic && !ctx.state.currentUser) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/auth/login' }
    });
  }

  return ctx.next();
}