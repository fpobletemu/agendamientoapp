-- ============================================================
-- MIGRATION 002: ROW LEVEL SECURITY
-- ============================================================

-- Función helper: retorna el business_id del usuario autenticado
CREATE OR REPLACE FUNCTION get_my_business_id()
RETURNS UUID AS $$
  SELECT business_id FROM user_access
  WHERE user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Función helper: verifica si el usuario tiene un rol específico
CREATE OR REPLACE FUNCTION has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_access ua
    JOIN roles r ON r.id = ua.role_id
    WHERE ua.user_id = auth.uid()
      AND r.name = role_name
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches          ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_schedules  ENABLE ROW LEVEL SECURITY;
ALTER TABLE services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services    ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules   ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_access       ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_configs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds           ENABLE ROW LEVEL SECURITY;

-- Tablas públicas de solo lectura (sin RLS estricto)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscription_plans_public_read" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "roles_public_read"              ON roles              FOR SELECT USING (true);
CREATE POLICY "permissions_public_read"        ON permissions        FOR SELECT USING (true);
CREATE POLICY "role_permissions_public_read"   ON role_permissions   FOR SELECT USING (true);

-- ============================================================
-- PROFILES
-- ============================================================

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- ============================================================
-- BUSINESSES
-- ============================================================

CREATE POLICY "businesses_select" ON businesses
  FOR SELECT USING (
    owner_id = auth.uid()
    OR id = get_my_business_id()
    OR has_role('SUPER_ADMIN')
    OR has_role('APP_STAFF')
  );

CREATE POLICY "businesses_insert" ON businesses
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "businesses_update" ON businesses
  FOR UPDATE USING (
    owner_id = auth.uid()
    OR has_role('SUPER_ADMIN')
  );

CREATE POLICY "businesses_delete" ON businesses
  FOR DELETE USING (has_role('SUPER_ADMIN'));

-- ============================================================
-- BRANCHES
-- ============================================================

CREATE POLICY "branches_select" ON branches
  FOR SELECT USING (
    business_id = get_my_business_id()
    OR has_role('SUPER_ADMIN')
    OR has_role('APP_STAFF')
  );

CREATE POLICY "branches_insert" ON branches
  FOR INSERT WITH CHECK (
    business_id = get_my_business_id()
    AND (has_role('BUSINESS_OWNER') OR has_role('SUPER_ADMIN'))
  );

CREATE POLICY "branches_update" ON branches
  FOR UPDATE USING (
    business_id = get_my_business_id()
    AND (has_role('BUSINESS_OWNER') OR has_role('BRANCH_MANAGER') OR has_role('SUPER_ADMIN'))
  );

CREATE POLICY "branches_delete" ON branches
  FOR DELETE USING (
    business_id = get_my_business_id()
    AND (has_role('BUSINESS_OWNER') OR has_role('SUPER_ADMIN'))
  );

-- ============================================================
-- BRANCH SCHEDULES
-- ============================================================

CREATE POLICY "branch_schedules_select" ON branch_schedules
  FOR SELECT USING (
    branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    OR has_role('SUPER_ADMIN')
  );

CREATE POLICY "branch_schedules_write" ON branch_schedules
  FOR ALL USING (
    branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    AND (has_role('BUSINESS_OWNER') OR has_role('BRANCH_MANAGER') OR has_role('SUPER_ADMIN'))
  );

-- ============================================================
-- SERVICES
-- ============================================================

CREATE POLICY "services_select" ON services
  FOR SELECT USING (
    business_id = get_my_business_id()
    OR has_role('SUPER_ADMIN')
  );

CREATE POLICY "services_write" ON services
  FOR ALL USING (
    business_id = get_my_business_id()
    AND (has_role('BUSINESS_OWNER') OR has_role('BRANCH_MANAGER') OR has_role('SUPER_ADMIN'))
  );

-- ============================================================
-- STAFF
-- ============================================================

CREATE POLICY "staff_profiles_select" ON staff_profiles
  FOR SELECT USING (
    branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    OR user_id = auth.uid()
    OR has_role('SUPER_ADMIN')
  );

CREATE POLICY "staff_profiles_write" ON staff_profiles
  FOR ALL USING (
    branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    AND (has_role('BUSINESS_OWNER') OR has_role('BRANCH_MANAGER') OR has_role('SUPER_ADMIN'))
  );

CREATE POLICY "staff_services_select" ON staff_services
  FOR SELECT USING (
    staff_id IN (
      SELECT id FROM staff_profiles
      WHERE branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    )
    OR has_role('SUPER_ADMIN')
  );

CREATE POLICY "staff_schedules_select" ON staff_schedules
  FOR SELECT USING (
    staff_id IN (
      SELECT id FROM staff_profiles
      WHERE branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    )
    OR has_role('SUPER_ADMIN')
  );

-- ============================================================
-- USER ACCESS
-- ============================================================

CREATE POLICY "user_access_select_own" ON user_access
  FOR SELECT USING (
    user_id = auth.uid()
    OR business_id = get_my_business_id()
    OR has_role('SUPER_ADMIN')
    OR has_role('APP_STAFF')
  );

CREATE POLICY "user_access_write" ON user_access
  FOR ALL USING (
    business_id = get_my_business_id()
    AND (has_role('BUSINESS_OWNER') OR has_role('SUPER_ADMIN'))
  );

-- ============================================================
-- CUSTOMERS
-- ============================================================

CREATE POLICY "customers_select" ON customers
  FOR SELECT USING (
    business_id = get_my_business_id()
    OR user_id = auth.uid()
    OR has_role('SUPER_ADMIN')
  );

CREATE POLICY "customers_insert" ON customers
  FOR INSERT WITH CHECK (business_id = get_my_business_id());

CREATE POLICY "customers_update" ON customers
  FOR UPDATE USING (
    business_id = get_my_business_id()
    OR user_id = auth.uid()
  );

-- ============================================================
-- APPOINTMENTS
-- ============================================================

CREATE POLICY "appointments_select" ON appointments
  FOR SELECT USING (
    branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    OR has_role('SUPER_ADMIN')
  );

CREATE POLICY "appointments_insert" ON appointments
  FOR INSERT WITH CHECK (
    branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
  );

CREATE POLICY "appointments_update" ON appointments
  FOR UPDATE USING (
    branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
  );

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE POLICY "payment_configs_select" ON payment_configs
  FOR SELECT USING (
    business_id = get_my_business_id()
    AND (has_role('BUSINESS_OWNER') OR has_role('SUPER_ADMIN'))
  );

CREATE POLICY "payment_configs_write" ON payment_configs
  FOR ALL USING (
    business_id = get_my_business_id()
    AND (has_role('BUSINESS_OWNER') OR has_role('SUPER_ADMIN'))
  );

CREATE POLICY "payments_select" ON payments
  FOR SELECT USING (
    appointment_id IN (
      SELECT id FROM appointments
      WHERE branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    )
    OR has_role('SUPER_ADMIN')
  );

CREATE POLICY "payment_events_select" ON payment_events
  FOR SELECT USING (has_role('SUPER_ADMIN') OR has_role('BUSINESS_OWNER'));

CREATE POLICY "refunds_select" ON refunds
  FOR SELECT USING (
    payment_id IN (
      SELECT p.id FROM payments p
      JOIN appointments a ON a.id = p.appointment_id
      JOIN branches b ON b.id = a.branch_id
      WHERE b.business_id = get_my_business_id()
    )
    OR has_role('SUPER_ADMIN')
  );

-- ============================================================
-- BLOCKED TIMES & APPOINTMENT NOTES
-- ============================================================

CREATE POLICY "blocked_times_select" ON blocked_times
  FOR SELECT USING (
    branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    OR has_role('SUPER_ADMIN')
  );

CREATE POLICY "appointment_notes_select" ON appointment_notes
  FOR SELECT USING (
    appointment_id IN (
      SELECT id FROM appointments
      WHERE branch_id IN (SELECT id FROM branches WHERE business_id = get_my_business_id())
    )
  );
