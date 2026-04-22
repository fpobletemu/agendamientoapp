# Base de Datos y Migraciones

**Última actualización:** 2026-04-22

---

## Motor

PostgreSQL 15+ gestionado por Supabase Cloud. Región: US East 2 (N. Virginia).

## Migraciones aplicadas

| Archivo | Descripción | Fecha |
|---|---|---|
| `001_initial_schema.sql` | Todas las tablas, FK, triggers y seed de roles/planes | 2026-04-22 |
| `002_rls_policies.sql` | Funciones helper y políticas RLS por tabla | 2026-04-22 |

## Cómo crear y aplicar una migración

```bash
# 1. Crear el archivo (nombrar descriptivamente)
touch supabase/migrations/003_nombre_descriptivo.sql

# 2. Escribir el SQL en ese archivo

# 3. Aplicar en la base de datos cloud
npx supabase db push --db-url "postgresql://postgres.yvsdqhqfirvjhtfkzxno:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

**Importante:** nunca modificar una migración ya aplicada. Siempre crear una nueva.

## Tablas

### Plataforma

#### `subscription_plans`
Planes SaaS disponibles. Datos seed incluidos en la migración 001.

| Columna | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| name | TEXT | free, starter, pro, enterprise |
| max_branches | INT | Límite de sucursales |
| max_staff | INT | Límite de staff |
| max_services | INT | Límite de servicios |
| price_monthly | NUMERIC | Precio mensual en CLP |

#### `profiles`
Extiende `auth.users` de Supabase. Se crea automáticamente al registrarse.

| Columna | Tipo | Descripción |
|---|---|---|
| id | UUID | FK → auth.users.id |
| full_name | TEXT | Nombre completo |
| avatar_url | TEXT | URL de foto de perfil |
| phone | TEXT | Teléfono |
| locale | TEXT | Idioma preferido (default: 'es') |

### Negocios (Tenants)

#### `businesses`
Entidad principal del tenant. Un negocio puede tener N sucursales.

| Columna | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| owner_id | UUID | FK → profiles.id |
| plan_id | UUID | FK → subscription_plans.id |
| name | TEXT | Nombre del negocio |
| slug | TEXT | URL slug único (ej: mi-barberia) |
| logo_url | TEXT | Logo |
| timezone | TEXT | Zona horaria (default: America/Santiago) |
| is_active | BOOL | Estado del negocio |

#### `branches`
Sucursales del negocio. Cada sucursal tiene su propio horario y staff.

#### `branch_schedules`
Horario semanal por sucursal. Un registro por día (0=Domingo, 6=Sábado).

#### `services`
Catálogo de servicios del negocio. Incluye duración y precio.

### Staff

#### `staff_profiles`
Perfil laboral de cada empleado. Un usuario puede ser staff en varias sucursales.

#### `staff_services`
Relación many-to-many: qué servicios puede realizar cada staff.

#### `staff_schedules`
Disponibilidad semanal del staff. Puede diferir del horario de la sucursal.

#### `blocked_times`
Bloqueos de agenda: vacaciones, ausencias, mantenimiento. Puede ser por sucursal o por staff específico.

### RBAC

#### `roles`
Catálogo de roles: SUPER_ADMIN, APP_STAFF, BUSINESS_OWNER, BRANCH_MANAGER, BUSINESS_STAFF, CUSTOMER.

#### `permissions`
Catálogo de permisos en formato `resource:action` (ej: appointments:create).

#### `role_permissions`
Tabla de cruce roles ↔ permisos.

#### `user_access`
Vincula un usuario con un rol en el contexto de un negocio o sucursal específica.

### Operaciones

#### `customers`
Clientes del negocio. Pueden estar vinculados a un `profile` (usuario registrado) o no (cliente invitado).

#### `appointments`
Citas. Estados posibles: `pending → confirmed → paid → in_progress → completed` o `cancelled` / `no_show`.

#### `appointment_notes`
Notas internas sobre una cita. Solo visibles para staff y managers.

### Pagos

#### `payment_configs`
Credenciales de pasarela de pago por negocio (encriptadas en JSONB).

#### `payments`
Registro de transacciones vinculadas a citas.

#### `payment_events`
Log inmutable de webhooks recibidos. Campo `idempotency_key` evita procesar el mismo evento dos veces.

#### `refunds`
Registro de devoluciones vinculadas a pagos.

## Convenciones

- Todas las tablas tienen `id UUID`, `created_at`, `updated_at`
- `updated_at` se actualiza automáticamente via trigger `update_updated_at()`
- Las FK usan `ON DELETE CASCADE` donde tiene sentido (ej: borrar negocio borra sus sucursales)
- Columnas booleanas de estado se llaman `is_active`
- Timestamps en `TIMESTAMPTZ` (con zona horaria)
