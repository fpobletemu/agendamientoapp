# Visión General del Producto

**Última actualización:** 2026-04-22

---

## ¿Qué es AppAgendamientos?

Plataforma SaaS de agendamiento online para negocios de servicios en Latinoamérica. Permite que múltiples negocios (barberías, spas, centros de estética, detailing, etc.) gestionen sus citas, personal y pagos desde una sola plataforma, con un portal público donde sus clientes pueden reservar en línea.

## Actores del sistema

### 1. Dueño del negocio (Business Owner)
Registra su negocio en la plataforma, configura sucursales, servicios y staff, y accede a reportes y finanzas.

### 2. Manager de sucursal (Branch Manager)
Gestiona la agenda diaria, el staff y los servicios de una sucursal específica.

### 3. Staff / Profesional
Ve su agenda personal, gestiona el estado de sus citas y atiende a clientes.

### 4. Cliente
Encuentra el negocio por su URL pública, selecciona servicio, profesional y horario, y paga en línea.

### 5. Super Admin (plataforma)
Administra todos los negocios registrados, planes de suscripción y configuración global.

## Flujo principal

```
1. Negocio se registra en la plataforma
2. Configura sucursales, horarios, servicios y staff
3. Comparte su link de reserva: agendamientoapp.vercel.app/{su-slug}
4. Cliente entra al link, elige servicio → profesional → horario → paga
5. Cliente recibe confirmación por email/SMS
6. Staff ve la cita en su agenda
7. Al finalizar el servicio, staff marca la cita como completada
```

## URL de reserva pública

Cada negocio tiene una URL única basada en su slug:
```
https://agendamientoapp.vercel.app/{slug-del-negocio}
```
Ejemplo: `https://agendamientoapp.vercel.app/barberia-chilena`

Esta página es pública — no requiere que el cliente tenga cuenta (puede reservar como invitado).

## Modelo de negocio (SaaS)

| Plan | Sucursales | Staff | Servicios | Precio/mes |
|---|---|---|---|---|
| Free | 1 | 3 | 10 | $0 |
| Starter | 2 | 10 | 30 | $19.990 CLP |
| Pro | 5 | 30 | 100 | $49.990 CLP |
| Enterprise | Ilimitado | Ilimitado | Ilimitado | $99.990 CLP |
