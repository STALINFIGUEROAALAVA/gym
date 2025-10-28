import { type PageProps } from '$fresh/server.ts';

export default function Home(props: PageProps) {
  const logged = !!(props.state as any).currentUser;

  return (
    <div class="container">
      <h1>Bienvenido al Sistema del Gimnasio</h1>
      {!logged
        ? (
          <>
            <p>Inicia sesión para administrar miembros, asistencia y pagos.</p>
            <a class="btn" href="/auth/login">Iniciar sesión</a>
            <a class="btn btn-secondary" href="/auth/register">Registrar administrador</a>
          </>
        )
        : (
          <>
            <p>Accede al panel para ver los indicadores.</p>
            <a class="btn" href="/dashboard">Ir al Panel</a>
          </>
        )}
    </div>
  );
}