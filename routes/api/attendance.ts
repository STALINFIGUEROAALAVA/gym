import { Handlers } from '$fresh/server.ts';
import { queryOne } from '../../db/client.ts';

export const handler: Handlers = {
  async POST(req) {
    const body = await req.json().catch(() => null);
    const member_id = Number(body?.member_id);
    if (!member_id) return new Response('member_id requerido', { status: 400 });

    const attendance = await queryOne<{ id: number }>(
      'INSERT INTO attendance (member_id) VALUES ($1) RETURNING id',
      [member_id]
    );
    return Response.json({ id: attendance?.id }, { status: 201 });
  }
};