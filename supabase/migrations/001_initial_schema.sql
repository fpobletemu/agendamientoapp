-- ============================================================
-- MIGRATION 001: SCHEMA INICIAL
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigger function para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PLATAFORMA
-- ============================================================

CREATE TABLE subscription_plans (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL UNIQUE,
  max_branches   INT NOT NULL DEFAULT 1,
  max_staff      INT NOT NULL DEFAULT 3,
  max_services   INT NOT NULL DEFAULT 10,
  price_monthly  NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- Extiende auth.users de Supabase
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  locale      TEXT DEFAULT 'es',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- NEGOCIOS (TENANTS)
-- ============================================================

CREATE TABLE businesses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES profiles(id),
  plan_id     UUID REFERENCES subscription_plans(id),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  logo_url    TEXT,
  timezone    TEXT NOT NULL DEFAULT 'America/Santiago',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE branches (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  address      TEXT,
  phone        TEXT,
  email        TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Horario semanal por sucursal (0=Domingo, 6=Sábado)
CREATE TABLE branch_schedules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id    UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  day_of_week  SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time    TIME NOT NULL,
  close_time   TIME NOT NULL,
  is_open      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (branch_id, day_of_week)
);

CREATE TABLE services (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  duration_min INT NOT NULL DEFAULT 30,
  price        NUMERIC(10,2) NOT NULL DEFAULT 0,
  color        TEXT DEFAULT '#6366f1',
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- STAFF
-- ============================================================

CREATE TABLE staff_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  branch_id   UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  bio         TEXT,
  avatar_url  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, branch_id)
);

-- Qué servicios puede realizar cada staff
CREATE TABLE staff_services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id    UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (staff_id, service_id)
);

-- Disponibilidad semanal del staff
CREATE TABLE staff_schedules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id     UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
  day_of_week  SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  is_working   BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (staff_id, day_of_week)
);

-- Bloqueos de agenda (vacaciones, ausencias, mantenimiento)
CREATE TABLE blocked_times (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id   UUID REFERENCES branches(id) ON DELETE CASCADE,
  staff_id    UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  CHECK (branch_id IS NOT NULL OR staff_id IS NOT NULL)
);

-- ============================================================
-- RBAC
-- ============================================================

CREATE TABLE roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  scope       TEXT NOT NULL CHECK (scope IN ('global', 'business', 'branch')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource    TEXT NOT NULL,
  action      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (resource, action)
);

CREATE TABLE role_permissions (
  role_id        UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id  UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Vincula usuario + rol con contexto de negocio o sucursal
CREATE TABLE user_access (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id      UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  business_id  UUID REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id    UUID REFERENCES branches(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role_id, business_id, branch_id)
);

-- ============================================================
-- CLIENTES Y CITAS
-- ============================================================

CREATE TABLE customers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES profiles(id),
  full_name    TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE appointments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id    UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  service_id   UUID NOT NULL REFERENCES services(id),
  staff_id     UUID NOT NULL REFERENCES staff_profiles(id),
  customer_id  UUID NOT NULL REFERENCES customers(id),
  starts_at    TIMESTAMPTZ NOT NULL,
  ends_at      TIMESTAMPTZ NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (
                 status IN ('pending','confirmed','paid','in_progress','completed','cancelled','no_show')
               ),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE appointment_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES profiles(id),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PAGOS
-- ============================================================

-- Credenciales de pasarela por negocio (encriptadas)
CREATE TABLE payment_configs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  gateway      TEXT NOT NULL CHECK (gateway IN ('mercadopago', 'webpay', 'flow')),
  credentials  JSONB NOT NULL DEFAULT '{}',
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (business_id, gateway)
);

CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  gateway         TEXT NOT NULL CHECK (gateway IN ('mercadopago', 'webpay', 'flow')),
  amount          NUMERIC(10,2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'CLP',
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (
                    status IN ('pending','processing','completed','failed','refunded')
                  ),
  gateway_tx_id   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Log inmutable de webhooks (idempotencia)
CREATE TABLE payment_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id       UUID REFERENCES payments(id),
  gateway          TEXT NOT NULL,
  event_type       TEXT NOT NULL,
  payload          JSONB NOT NULL DEFAULT '{}',
  idempotency_key  TEXT NOT NULL UNIQUE,
  processed_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE refunds (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id  UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount      NUMERIC(10,2) NOT NULL,
  reason      TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
  gateway_ref TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TRIGGERS UPDATED_AT
-- ============================================================

CREATE TRIGGER trg_subscription_plans_updated_at  BEFORE UPDATE ON subscription_plans  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at            BEFORE UPDATE ON profiles            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_businesses_updated_at          BEFORE UPDATE ON businesses          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_branches_updated_at            BEFORE UPDATE ON branches            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_branch_schedules_updated_at    BEFORE UPDATE ON branch_schedules    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_services_updated_at            BEFORE UPDATE ON services            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_staff_profiles_updated_at      BEFORE UPDATE ON staff_profiles      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_staff_schedules_updated_at     BEFORE UPDATE ON staff_schedules     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_blocked_times_updated_at       BEFORE UPDATE ON blocked_times       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_customers_updated_at           BEFORE UPDATE ON customers           FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_appointments_updated_at        BEFORE UPDATE ON appointments        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payment_configs_updated_at     BEFORE UPDATE ON payment_configs     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated_at            BEFORE UPDATE ON payments            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_refunds_updated_at             BEFORE UPDATE ON refunds             FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED: DATOS INICIALES
-- ============================================================

INSERT INTO subscription_plans (name, max_branches, max_staff, max_services, price_monthly) VALUES
  ('free',       1,   3,   10,     0),
  ('starter',    2,  10,   30, 19990),
  ('pro',        5,  30,  100, 49990),
  ('enterprise', 999, 999, 999, 99990);

INSERT INTO roles (name, scope) VALUES
  ('SUPER_ADMIN',    'global'),
  ('APP_STAFF',      'global'),
  ('BUSINESS_OWNER', 'business'),
  ('BRANCH_MANAGER', 'branch'),
  ('BUSINESS_STAFF', 'branch'),
  ('CUSTOMER',       'global');

INSERT INTO permissions (resource, action) VALUES
  ('businesses',     'create'),
  ('businesses',     'read'),
  ('businesses',     'update'),
  ('businesses',     'delete'),
  ('branches',       'create'),
  ('branches',       'read'),
  ('branches',       'update'),
  ('branches',       'delete'),
  ('services',       'create'),
  ('services',       'read'),
  ('services',       'update'),
  ('services',       'delete'),
  ('staff',          'create'),
  ('staff',          'read'),
  ('staff',          'update'),
  ('staff',          'delete'),
  ('appointments',   'create'),
  ('appointments',   'read'),
  ('appointments',   'update'),
  ('appointments',   'delete'),
  ('payments',       'read'),
  ('payments',       'refund'),
  ('payment_configs','manage');
