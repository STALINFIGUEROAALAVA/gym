# Sistema web para gimnasio (Deno Fresh + PostgreSQL)

Este proyecto es un esqueleto funcional para administrar un gimnasio:
- Autenticación (JWT en cookie HttpOnly)
- Gestión de miembros (alta, edición, eliminación)
- Asistencia (check-in)
- Estructura escalable para planes, membresías y pagos

## Requisitos

- Deno 1.42+
- PostgreSQL 13+
- Variables de entorno configuradas

## Configuración

1. Clona o abre tu repo `STALINFIGUEROAALAVA/gym` y copia estos archivos en la raíz.
2. Crea un archivo `.env` (puedes basarte en `.env.example`):
   ```bash
   DATABASE_URL=postgres://usuario:password@localhost:5432/gimnasio
   JWT_SECRET=pon-un-secreto-seguro
   ```
3. Instala dependencias al vuelo (Deno usa URLs) y ejecuta migraciones:
   ```bash
   deno task migrate:up
   ```
4. Inicia el servidor:
   ```bash
   deno task dev
   # o en producción
   deno task start
   ```
5. Abre http://localhost:8000
6. Registra un usuario administrador en `/auth/register` y luego inicia sesión en `/auth/login`.

## Estructura

- `routes/` páginas y APIs (Fresh)
- `routes/_middleware.ts` autenticación global
- `services/` acceso a datos por dominio
- `db/` conexión y migraciones
- `utils/` utilidades (JWT, bcrypt)
- `static/` estilos

## Extensiones sugeridas

- CRUD de planes y membresías en UI
- Pagos y conciliación
- Reportes (KPIs, vencimientos)
- Check-in por QR y kiosko de recepción
- Roles (admin, entrenador, recepción)
- Auditoría y logs

## Seguridad

- Activa HTTPS en producción y pon `secure: true` en la cookie
- Usa roles y autorización por ruta/acción
- Valida inputs y usa consultas parametrizadas (ya aplicado)
- Mantén `JWT_SECRET` fuera del código

## Notas

- `fresh.gen.ts` normalmente se genera automáticamente en desarrollo. Aquí se incluyó una versión manual para simplificar el arranque. Si agregas más rutas o islas, vuelve a generarlo o actualízalo.