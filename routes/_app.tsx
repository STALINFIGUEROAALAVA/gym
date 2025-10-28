/** App wrapper global con Layout y estilos. */
import { type AppProps } from '$fresh/server.ts';
import Layout from '../components/Layout.tsx';

export default function App({ Component, state }: AppProps) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gimnasio</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Layout user={state.currentUser}>
          <Component />
        </Layout>
      </body>
    </html>
  );
}