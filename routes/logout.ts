import { deleteCookie } from 'std/http/cookie.ts';

export const handler = {
  GET(_req: Request) {
    const headers = new Headers();
    deleteCookie(headers, 'auth', { path: '/' });
    headers.set('Location', '/');
    return new Response(null, { status: 303, headers });
  }
};