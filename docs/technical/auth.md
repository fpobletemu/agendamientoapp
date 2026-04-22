# Autenticación y Middleware

**Última actualización:** 2026-04-22

---

## Proveedor

Supabase Auth con JWT. El token se almacena en cookies HTTP-only y se refresca automáticamente.

## Archivos relevantes

| Archivo | Descripción |
|---|---|
| `src/lib/supabase/client.ts` | Cliente para Client Components (browser) |
| `src/lib/supabase/server.ts` | Cliente para Server Components y API Routes |
| `src/lib/supabase/admin.ts` | Cliente service_role para operaciones privilegiadas |
| `src/middleware.ts` | Protección de rutas y redirecciones |

## Middleware

El middleware (`src/middleware.ts`) se ejecuta en cada request antes de llegar a la página.

### Lógica

```
Request llega
  ├── ¿Es ruta pública o widget de reserva? → continuar
  ├── ¿No hay sesión y es ruta privada? → redirigir a /auth/login?redirect=<ruta>
  └── ¿Hay sesión y va a /auth/login o /register? → redirigir a /dashboard
```

### Rutas públicas definidas

```typescript
const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/auth/reset-password']
```

Las rutas con patrón `/{slug}` (ej: `/mi-barberia`) son automáticamente tratadas como widgets de reserva públicos.

### Matcher

El middleware se aplica a todas las rutas excepto archivos estáticos:

```typescript
matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
```

## Uso del cliente en Server Components

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // ...
}
```

## Uso del cliente en Client Components

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export function MyComponent() {
  const supabase = createClient()
  // ...
}
```

## Uso del cliente admin (solo en API Routes)

```typescript
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const supabase = createAdminClient()
  // Bypasea RLS — usar con cuidado
}
```

## Flujo de registro

1. Usuario completa formulario (nombre, email, contraseña)
2. Se llama a `supabase.auth.signUp()`
3. Supabase crea el registro en `auth.users`
4. Un trigger en DB crea automáticamente el registro en `profiles`
5. Usuario recibe email de confirmación (configurable en Supabase)
6. Al confirmar, queda autenticado y es redirigido al dashboard

## Flujo de login

1. Usuario ingresa email y contraseña
2. Se llama a `supabase.auth.signInWithPassword()`
3. Supabase retorna el JWT y lo almacena en cookies
4. Middleware detecta la sesión y permite acceso a rutas privadas

## Próximo: OAuth (futuro)

Se puede agregar login con Google/GitHub fácilmente con `supabase.auth.signInWithOAuth()`. No está en el scope del MVP.
