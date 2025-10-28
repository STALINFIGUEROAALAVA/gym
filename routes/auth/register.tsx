import { Handlers, PageProps } from '$fresh/server.ts';
import { getUserByEmail, createUser } from '../../services/users.ts';
import { hashPassword } from '../../utils/auth.ts';

type Data = { success?: string; error?: string };

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    return ctx.render({});
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const role = 'admin';

    if (!email || !password) {
      return ctx.render({ error: 'Email y contraseña requeridos' });
    }
    const exists = await getUserByEmail(email);
    if (exists) {
      return ctx.render({ error: 'Ya existe un usuario con ese email' });
    }
    const password_hash = await hashPassword(password);
    await createUser({ email, password_hash, role });
    return ctx.render({ success: 'Usuario creado. Ya puedes iniciar sesión.' });
  }
};

export default function RegisterPage(props: PageProps<Data>) {
  return (
    <div class="auth">
      <h1>Registrar administrador</h1>
      {props.data?.error && <p class="error">{props.data.error}</p>}
      {props.data?.success && <p class="success">{props.data.success}</p>}
      <form method="POST">
        <label>
          Correo
          <input name="email" type="email" required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" required />
        </label>
        <button class="btn" type="submit">Crear cuenta</button>
      </form>
    </div>
  );
}