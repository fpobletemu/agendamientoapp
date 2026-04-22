# Stack Tecnológico

**Última actualización:** 2026-04-22

---

## Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 14+ | Framework principal, App Router |
| TypeScript | 5+ | Tipado estático en todo el proyecto |
| Tailwind CSS | 3+ | Estilos utilitarios |
| Shadcn/UI | latest | Componentes UI (basado en Radix UI) |

## Backend y Base de datos

| Tecnología | Uso |
|---|---|
| Supabase | BaaS — PostgreSQL, Auth, Storage, Realtime |
| PostgreSQL 15+ | Base de datos relacional principal |
| Row Level Security (RLS) | Aislamiento de datos por tenant |
| Supabase Auth | Autenticación con JWT |

## Infraestructura

| Servicio | Uso | Plan |
|---|---|---|
| Vercel | Deploy del frontend Next.js | Free |
| Supabase Cloud | Base de datos y auth | Free |
| GitHub | Control de versiones | Free |

## Pagos (integración futura)

| Pasarela | Mercado | Estado |
|---|---|---|
| Mercado Pago | Chile, Argentina, México, etc. | Pendiente |
| Webpay (Transbank) | Chile | Pendiente |
| Flow | Chile | Pendiente |

## Notificaciones (integración futura)

| Servicio | Canal | Estado |
|---|---|---|
| Resend | Email | Pendiente |
| Twilio | SMS | Pendiente |

## Herramientas de desarrollo

| Herramienta | Uso |
|---|---|
| Supabase CLI | Gestión de migraciones SQL |
| ESLint | Linting de código |
| Git | Control de versiones |

## Decisiones de diseño

**¿Por qué Supabase y no un backend propio?**
Supabase proporciona PostgreSQL con RLS, autenticación JWT y API REST generada automáticamente. Esto elimina la necesidad de construir una capa de API desde cero para el MVP, acelerando el desarrollo sin sacrificar seguridad ni escalabilidad.

**¿Por qué Next.js App Router?**
Permite mezclar Server Components (para queries a DB sin exponer credenciales) con Client Components (para interactividad) en la misma aplicación, con una sola base de código.

**¿Por qué un solo proyecto Supabase (dev + demo)?**
Para mantener la capa gratuita durante el desarrollo inicial. Cuando el producto tenga usuarios reales se separarán en proyectos distintos.
