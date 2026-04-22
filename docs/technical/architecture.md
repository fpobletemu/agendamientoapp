# Arquitectura y Estructura de Carpetas

**Última actualización:** 2026-04-22

---

## Estructura de carpetas

```
appagendamientos/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Rutas sin autenticación
│   │   │   ├── [slug]/               # Widget de reserva pública del negocio
│   │   │   └── auth/                 # Login, registro, reset de contraseña
│   │   ├── (dashboard)/              # Rutas protegidas con layout de dashboard
│   │   │   ├── dashboard/            # Página principal post-login
│   │   │   ├── [businessSlug]/       # Contexto del negocio
│   │   │   │   ├── overview/
│   │   │   │   ├── branches/
│   │   │   │   ├── services/
│   │   │   │   ├── staff/
│   │   │   │   ├── appointments/
│   │   │   │   └── settings/
│   │   │   └── admin/                # Solo SUPER_ADMIN y APP_STAFF
│   │   └── api/
│   │       ├── webhooks/[gateway]/   # Endpoints de webhooks de pago
│   │       ├── appointments/
│   │       └── availability/
│   ├── components/
│   │   ├── ui/                       # Componentes Shadcn/UI base
│   │   ├── booking/                  # Flujo de reserva pública
│   │   ├── dashboard/                # Componentes del panel de gestión
│   │   └── shared/                   # Componentes reutilizables
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Cliente para Client Components
│   │   │   ├── server.ts             # Cliente para Server Components y API Routes
│   │   │   ├── admin.ts              # Cliente con service_role (solo servidor)
│   │   │   └── types.ts              # Tipos TypeScript del schema
│   │   ├── payments/                 # Adaptadores por pasarela de pago
│   │   ├── notifications/            # Servicios de email y SMS
│   │   └── rbac/                     # Helpers de verificación de permisos
│   └── middleware.ts                 # Protección de rutas y redirecciones
├── supabase/
│   ├── migrations/                   # Archivos SQL numerados
│   │   ├── 001_initial_schema.sql
│   │   └── 002_rls_policies.sql
│   └── config.toml
├── docs/                             # Documentación del proyecto
├── .env.local                        # Variables de entorno locales (gitignored)
├── .env.example                      # Plantilla de variables de entorno
└── .claude/settings.json             # Configuración de Claude Code
```

## Flujo de una request

```
Browser
  └── middleware.ts          ← verifica sesión y redirige si es necesario
        └── Server Component ← llama a supabase/server.ts, lee datos
              └── Client Component ← interactividad con supabase/client.ts
                    └── API Route ← mutaciones, webhooks, pagos
                          └── supabase/admin.ts ← operaciones privilegiadas
```

## Multi-tenancy

La plataforma usa **shared database, shared schema**. Todas las tablas de negocio tienen una columna `business_id` que actúa como discriminador. Las políticas RLS garantizan que cada usuario solo puede ver y modificar datos de su propio `business_id`.

No se usan schemas separados por tenant porque:
- Supabase free tier no soporta múltiples schemas con RLS bien
- La complejidad de mantenimiento aumenta significativamente
- Row-level isolation es suficiente para el volumen esperado

## Entornos

| Entorno | URL | Supabase | Rama Git |
|---|---|---|---|
| Desarrollo local | localhost:3000 | Mismo proyecto cloud | develop |
| Demo/producción | agendamientoapp.vercel.app | Mismo proyecto cloud | main |
