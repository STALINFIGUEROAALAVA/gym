import { Handlers } from '$fresh/server.ts';
import { listMembers, createMember } from '../../services/members.ts';

export const handler: Handlers = {
  async GET() {
    const members = await listMembers();
    return Response.json(members);
  },
  async POST(req) {
    const body = await req.json().catch(() => null);
    if (!body?.full_name) return new Response('full_name requerido', { status: 400 });
    const member = await createMember({
      full_name: body.full_name,
      email: body.email ?? null,
      phone: body.phone ?? null
    });
    return Response.json(member, { status: 201 });
  }
};