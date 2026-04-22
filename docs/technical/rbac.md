# Sistema de Roles y Permisos (RBAC)

**Última actualización:** 2026-04-22

---

## Roles del sistema

| Rol | Scope | Descripción |
|---|---|---|
| `SUPER_ADMIN` | Global | Control total del ecosistema SaaS |
| `APP_STAFF` | Global | Soporte técnico — puede ver negocios para debugging |
| `BUSINESS_OWNER` | Negocio | Dueño — acceso total a sus sucursales y finanzas |
| `BRANCH_MANAGER` | Sucursal | Gestiona agenda, staff y servicios de una sede |
| `BUSINESS_STAFF` | Sucursal | Ve y gestiona solo su propia agenda de trabajo |
| `CUSTOMER` | Global | Reserva servicios y ve su historial |

## Cómo funciona

El acceso se determina por la tabla `user_access`, que vincula:

```
user_id + role_id + business_id (opcional) + branch_id (opcional)
```

**Ejemplos:**
- `SUPER_ADMIN`: `user_id = X, role_id = SUPER_ADMIN, business_id = null, branch_id = null`
- `BUSINESS_OWNER`: `user_id = X, role_id = BUSINESS_OWNER, business_id = Y, branch_id = null`
- `BRANCH_MANAGER`: `user_id = X, role_id = BRANCH_MANAGER, business_id = Y, branch_id = Z`

## Funciones helper en DB

```sql
-- Retorna el business_id del usuario autenticado
get_my_business_id() → UUID

-- Verifica si el usuario tiene un rol específico
has_role('BUSINESS_OWNER') → BOOLEAN
```

Estas funciones leen `auth.uid()` (el JWT del usuario actual) para determinar el contexto.

## Matriz de permisos

| Permiso | SUPER_ADMIN | BUSINESS_OWNER | BRANCH_MANAGER | BUSINESS_STAFF | CUSTOMER |
|---|---|---|---|---|---|
| businesses:create | ✓ | — | — | — | — |
| businesses:update | ✓ | ✓ | — | — | — |
| branches:create | ✓ | ✓ | — | — | — |
| branches:update | ✓ | ✓ | ✓ | — | — |
| services:manage | ✓ | ✓ | ✓ | — | — |
| staff:manage | ✓ | ✓ | ✓ | — | — |
| appointments:create | ✓ | ✓ | ✓ | ✓ | ✓ |
| appointments:view_all | ✓ | ✓ | ✓ | — | — |
| payments:read | ✓ | ✓ | — | — | — |
| payments:refund | ✓ | ✓ | — | — | — |
| payment_configs:manage | ✓ | ✓ | — | — | — |

## RLS como segunda capa de seguridad

Las políticas RLS en PostgreSQL refuerzan el aislamiento a nivel de base de datos, independientemente de la lógica de la aplicación. Incluso si hay un bug en el código, RLS previene que un usuario acceda a datos de otro tenant.

Ver detalles en [database.md](database.md) y en `supabase/migrations/002_rls_policies.sql`.

## Verificación de permisos en código (futuro)

Se implementará un helper en `src/lib/rbac/` para verificar permisos en Server Components y API Routes:

```typescript
// Ejemplo futuro
import { checkPermission } from '@/lib/rbac'

const canManage = await checkPermission(user, 'services:manage', { businessId })
```
