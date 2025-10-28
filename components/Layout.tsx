import { type ComponentChildren } from 'preact';

type Props = { user?: { email: string; role: string } | undefined; children: ComponentChildren };

export default function Layout({ user, children }: Props) {
  return (
    <div>
      <nav class="navbar">
        <a class="brand" href="/">Gimnasio</a>
        <div class="spacer" />
        {user
          ? (
            <>
              <a href="/dashboard">Panel</a>
              <a href="/members">Miembros</a>
              <a href="/logout">Salir</a>
              <span class="user">{user.email}</span>
            </>
          )
          : (
            <>
              <a href="/auth/login">Entrar</a>
              <a href="/auth/register">Registro</a>
            </>
          )}
      </nav>
      <main>{children}</main>
    </div>
  );
}