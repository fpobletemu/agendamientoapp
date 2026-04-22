# Documentación — AppAgendamientos

**Última actualización:** 2026-04-22
**Versión:** 0.1.0 (Fase 1 — Infraestructura base)

Plataforma SaaS multi-tenant de agendamiento para negocios de servicios (barberías, spas, detailing, etc.) orientada al mercado latinoamericano.

---

## Índice de documentación

### Técnica
- [Stack tecnológico](technical/stack.md)
- [Arquitectura y estructura de carpetas](technical/architecture.md)
- [Base de datos y migraciones](technical/database.md)
- [Autenticación y middleware](technical/auth.md)
- [Sistema de roles y permisos (RBAC)](technical/rbac.md)
- [Variables de entorno y configuración](technical/environment.md)

### Uso y funcionamiento
- [Visión general del producto](usage/overview.md)
- [Guía para dueños de negocio](usage/business-owner.md)
- [Guía para staff](usage/staff.md)
- [Guía para clientes](usage/customer.md)

### Proyecto
- [Roadmap y estado actual](roadmap.md)

---

## Estado actual del proyecto

| Módulo | Estado |
|---|---|
| Infraestructura (repo, Vercel, Supabase) | Completado |
| Schema de base de datos + RLS | Completado |
| Clientes Supabase + Middleware auth | Completado |
| Login y registro | En progreso |
| Dashboard base | Pendiente |
| Gestión de negocios y sucursales | Pendiente |
| Gestión de servicios y staff | Pendiente |
| Motor de disponibilidad | Pendiente |
| Widget de reserva público | Pendiente |
| Integración de pagos | Pendiente |

---

## Convención de actualización

Cada vez que se modifique un archivo de esta carpeta, actualizar la línea `**Última actualización:**` con la fecha del cambio en formato `YYYY-MM-DD`.
