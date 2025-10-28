import { Handlers, PageProps } from '$fresh/server.ts';
import { getMember, updateMember, deleteMember } from '../../services/members.ts';

type Member = {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
};

type Data = { member: Member; error?: string; success?: string };

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    const member = await getMember(id);
    if (!member) return new Response('No encontrado', { status: 404 });
    return ctx.render({ member });
  },
  async POST(req, ctx) {
    const id = Number(ctx.params.id);
    const form = await req.formData();
    const full_name = String(form.get('full_name') ?? '');
    const email = form.get('email') ? String(form.get('email')) : null;
    const phone = form.get('phone') ? String(form.get('phone')) : null;

    if (!full_name) {
      const member = await getMember(id);
      return ctx.render({ member: member!, error: 'El nombre es requerido' });
    }

    await updateMember(id, { full_name, email, phone });
    const member = await getMember(id);
    return ctx.render({ member: member!, success: 'Actualizado' });
  },
  async DELETE(_req, ctx) {
    const id = Number(ctx.params.id);
    await deleteMember(id);
    return new Response(null, { status: 204 });
  }
};

export default function MemberDetail({ data }: PageProps<Data>) {
  const m = data.member;

  return (
    <div class="container">
      <h1>Miembro #{m.id}</h1>
      {data.error && <p class="error">{data.error}</p>}
      {data.success && <p class="success">{data.success}</p>}
      <form method="POST" class="card">
        <div class="grid">
          <label>
            Nombre
            <input name="full_name" value={m.full_name} />
          </label>
          <label>
            Email
            <input name="email" type="email" value={m.email ?? ''} />
          </label>
          <label>
            Teléfono
            <input name="phone" value={m.phone ?? ''} />
          </label>
        </div>
        <div class="inline">
          <button class="btn" type="submit">Guardar</button>
          <button
            class="btn btn-danger"
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              if (!confirm('¿Eliminar miembro?')) return;
              await fetch(window.location.pathname, { method: 'DELETE' });
              window.location.href = '/members';
            }}
          >
            Eliminar
          </button>
        </div>
      </form>
    </div>
  );
}