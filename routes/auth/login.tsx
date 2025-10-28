import { Handlers, PageProps } from '$fresh/server.ts';
import { getUserByEmail } from '../../services/users.ts';
import { verifyPassword } from '../../utils/auth.ts';
import { signJwt } from '../../utils/jwt.ts';
import { setCookie } from 'std/http/cookie.ts';

type Data = { error?: string };

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    return ctx.render({});
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    const user = await getUserByEmail(email);
    if (!user) {
      return ctx.render({ error: 'Credenciales inválidas' });
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return ctx.render({ error: 'Credenciales inválidas' });
    }

    const token = await signJwt({
      uid: user.id,
      email: user.email,
      role: user.role
    });

    const headers = new Headers();
    setCookie(headers, {
      name: 'auth',
      value: token,
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      path: '/'
    });
    headers.set('Location', '/dashboard');

    return new Response(null, { status: 303, headers });
  }
};

export default function LoginPage(props: PageProps<Data>) {
  return (
    <div class="auth">
      <h1>Iniciar sesión</h1>
      {props.data?.error && <p class="error">{props.data.error}</p>}
      <form method="POST">
        <label>
          Correo
          <input name="email" type="email" required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" required />
        </label>
        <button class="btn" type="submit">Entrar</button>
      </form>
      <p>
        ¿No tienes cuenta? <a href="/auth/register">Regístrate</a>
      </p>
    </div>
  );
}