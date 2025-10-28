import { Handlers, PageProps } from '$fresh/server.ts';
import { queryValue } from '../db/client.ts';

type Data = {
  userEmail: string;
  metrics: {
    members: number;
    activeMemberships: number;
    checkinsToday: number;
  };
};

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const user = (ctx.state as any).currentUser;
    const [members, activeMemberships, checkinsToday] = await Promise.all([
      queryValue<number>('SELECT COUNT(*)::int FROM members'),
      queryValue<number>(
        'SELECT COUNT(*)::int FROM memberships WHERE status = $1 AND end_date >= CURRENT_DATE',
        ['active']
      ),
      queryValue<number>(
        'SELECT COUNT(*)::int FROM attendance WHERE DATE(check_in_at) = CURRENT_DATE'
      )
    ]);

    return ctx.render({
      userEmail: user.email,
      metrics: {
        members: members ?? 0,
        activeMemberships: activeMemberships ?? 0,
        checkinsToday: checkinsToday ?? 0
      }
    });
  }
};

export default function Dashboard({ data }: PageProps<Data>) {
  return (
    <div class="container">
      <h1>Panel</h1>
      <p>Usuario: {data.userEmail}</p>
      <div class="grid">
        <div class="card">
          <h3>Miembros</h3>
          <p class="kpi">{data.metrics.members}</p>
        </div>
        <div class="card">
          <h3>Membresías activas</h3>
          <p class="kpi">{data.metrics.activeMemberships}</p>
        </div>
        <div class="card">
          <h3>Check-ins hoy</h3>
          <p class="kpi">{data.metrics.checkinsToday}</p>
        </div>
      </div>
    </div>
  );
}