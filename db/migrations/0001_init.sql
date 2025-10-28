-- Usuarios del sistema (admins/entrenadores)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Miembros del gimnasio
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Planes disponibles (mensual, trimestral, etc.)
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration_days INT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Membresías contratadas por miembros
CREATE TABLE IF NOT EXISTS memberships (
  id SERIAL PRIMARY KEY,
  member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  plan_id INT NOT NULL REFERENCES plans(id),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active | expired | cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Asistencia (check-in)
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  check_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pagos (opcional para futuras pantallas)
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  membership_id INT NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  method TEXT NOT NULL DEFAULT 'cash', -- cash | card | transfer
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_memberships_member ON memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance((DATE(check_in_at)));