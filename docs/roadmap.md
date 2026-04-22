# Roadmap y Estado del Proyecto

**Última actualización:** 2026-04-21

---

## Fase 1 — Infraestructura base ✓ COMPLETADA

- [x] Repo GitHub con ramas `main` y `develop`
- [x] Proyecto Next.js 16 + TypeScript + Tailwind + Shadcn/UI (Base UI)
- [x] Supabase Cloud configurado
- [x] Deploy automático en Vercel
- [x] Schema de base de datos completo (20 tablas)
- [x] Políticas RLS para aislamiento multi-tenant
- [x] Clientes Supabase (server, client, admin)
- [x] Middleware de autenticación y protección de rutas
- [x] Documentación técnica inicial

## Fase 2 — Autenticación y onboarding ✓ COMPLETADA

- [x] Página de login (`/auth/login`)
- [x] Página de registro (`/auth/register`)
- [x] Reset de contraseña (`/auth/reset-password`)
- [x] Trigger en DB para crear `profiles` automáticamente al registrarse
- [x] Asignación de rol SUPER_ADMIN a cuenta de administrador
- [x] Flujo de onboarding: crear negocio al primer login (`/dashboard/onboarding`)
- [x] Dashboard base post-login con redirect inteligente
- [x] Sidebar responsive (desktop + mobile Sheet)

## Fase 3 — Core del negocio 🔄 EN PROGRESO

- [x] CRUD de sucursales (crear, editar, desactivar)
- [x] CRUD de servicios (crear, editar, activar/desactivar, color, precio, duración)
- [x] Página overview del negocio (stats cards + quick setup guide)
- [x] Página de configuración del negocio (nombre, zona horaria)
- [x] TypeScript compilation limpia (0 errores)
- [ ] CRUD de horarios por sucursal (`branch_schedules`)
- [ ] Invitación y gestión de staff (enviar invite por email)
- [ ] Perfiles de staff (`staff_profiles`)
- [ ] Asignación de servicios a staff (`staff_services`)
- [ ] Configuración de horarios del staff (`staff_schedules`)
- [ ] Bloqueos de agenda (`blocked_times`)

## Fase 4 — Motor de reservas

- [ ] Algoritmo de cálculo de disponibilidad
- [ ] Widget de reserva público (`/{slug}`)
- [ ] Flujo completo de reserva sin cuenta
- [ ] Gestión de citas en dashboard
- [ ] Estados de cita y transiciones
- [ ] Notificaciones por email (confirmación, recordatorio)

## Fase 5 — Pagos

- [ ] Integración Mercado Pago (checkout)
- [ ] Webhook receiver Mercado Pago
- [ ] Configuración de credenciales por negocio
- [ ] Flujo de reembolso automático
- [ ] Integración Webpay (Transbank)
- [ ] Integración Flow

## Fase 6 — Pulido y lanzamiento

- [ ] Diseño responsive completo
- [ ] Página de landing pública
- [ ] Gestión de suscripciones y planes
- [ ] Reportes y analytics básicos
- [ ] Dominio personalizado
- [ ] Tests E2E del flujo de reserva

---

## Decisiones pendientes

| Decisión | Contexto |
|---|---|
| SMS provider | Twilio vs alternativa más barata para Chile |
| Dominio personalizado por negocio | ¿Cada negocio puede tener su propio dominio? |
| App móvil | ¿PWA o app nativa en el futuro? |
