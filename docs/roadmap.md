# Roadmap y Estado del Proyecto

**Última actualización:** 2026-04-22

---

## Fase 1 — Infraestructura base ✓ COMPLETADA

- [x] Repo GitHub con ramas `main` y `develop`
- [x] Proyecto Next.js 14 + TypeScript + Tailwind + Shadcn/UI
- [x] Supabase Cloud configurado
- [x] Deploy automático en Vercel
- [x] Schema de base de datos completo (20 tablas)
- [x] Políticas RLS para aislamiento multi-tenant
- [x] Clientes Supabase (server, client, admin)
- [x] Middleware de autenticación y protección de rutas
- [x] Documentación técnica inicial

## Fase 2 — Autenticación y onboarding 🔄 EN PROGRESO

- [ ] Página de login
- [ ] Página de registro
- [ ] Reset de contraseña
- [ ] Trigger en DB para crear `profiles` automáticamente al registrarse
- [ ] Flujo de onboarding: crear negocio al primer login
- [ ] Dashboard base post-login

## Fase 3 — Core del negocio

- [ ] CRUD de sucursales
- [ ] CRUD de horarios por sucursal
- [ ] CRUD de servicios
- [ ] Invitación y gestión de staff
- [ ] Asignación de servicios a staff
- [ ] Configuración de horarios del staff
- [ ] Bloqueos de agenda

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
