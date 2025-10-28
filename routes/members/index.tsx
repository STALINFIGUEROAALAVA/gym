import { Handlers, PageProps } from '$fresh/server.ts';
import { createMember, listMembers } from '../../services/members.ts';

type Member = {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
};

type Data = { members: Member[]; error?: string };

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const members = await listMembers();
    return ctx.render({ members });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const full_name = String(form.get('full_name') ?? '');
    const email = form.get('email') ? String(form.get('email')) : null;
    const phone = form.get('phone') ? String(form.get('phone')) : null;

    if (!full_name) {
      const members = await listMembers();
      return ctx.render({ members, error: 'El nombre es requerido' });
    }

    await createMember({ full_name, email, phone });
    const headers = new Headers({ Location: '/members' });
    return new Response(null, { status: 303, headers });
  }
};

export default function MembersPage({ data }: PageProps<Data>) {
  return (
    <div class="container">
      <h1>Miembros</h1>
      <form method="POST" class="card">
        <h3>Nuevo miembro</h3>
        {data.error && <p class="error">{data.error}</p>}
        <div class="grid">
          <label>
            Nombre completo
            <input name="full_name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" />
          </label>
          <label>
            Teléfono
            <input name="phone" />
          </label>
        </div>
        <button class="btn" type="submit">Crear</button>
      </form>

      <div class="list">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Alta</th>
            </tr>
          </thead>
          <tbody>
            {data.members.map((m) => (
              <tr>
                <td><a href={`/members/${m.id}`}>{m.id}</a></td>
                <td>{m.full_name}</td>
                <td>{m.email ?? '-'}</td>
                <td>{m.phone ?? '-'}</td>
                <td>{new Date(m.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}