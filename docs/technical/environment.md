# Variables de Entorno y Configuración

**Última actualización:** 2026-04-22

---

## Archivos de entorno

| Archivo | Commiteado | Uso |
|---|---|---|
| `.env.local` | No (gitignored) | Variables locales de desarrollo |
| `.env.example` | Sí | Plantilla de referencia para el equipo |

## Variables requeridas

### Supabase (obligatorias)

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-public-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-secret-key]
```

**Dónde obtenerlas:** Supabase Dashboard → Settings → API

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto (pública, va al browser)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública con RLS (pública, va al browser)
- `SUPABASE_SERVICE_ROLE_KEY`: Clave secreta que bypasea RLS — **nunca exponer al cliente**

### Conexión directa a DB (solo para migraciones)

```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@[host]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@[host]:5432/postgres"
```

**Uso:** Solo se usan al correr `npx supabase db push`. No se usan en runtime de la aplicación.

### App

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # En Vercel: https://tu-app.vercel.app
```

## Variables futuras (cuando se integren)

```env
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=

# Webpay (Transbank)
TRANSBANK_COMMERCE_CODE=
TRANSBANK_API_KEY=

# Flow
FLOW_API_KEY=
FLOW_SECRET_KEY=

# Email (Resend)
RESEND_API_KEY=

# SMS (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Seguridad webhooks
WEBHOOK_SECRET=
```

## Configuración en Vercel

Las variables de entorno de Vercel se configuran en:
**Vercel Dashboard → Proyecto → Settings → Environment Variables**

Las variables `NEXT_PUBLIC_*` son públicas (van al bundle del browser).
Las variables sin ese prefijo son solo del servidor.

## Configuración de Supabase para nuevos desarrolladores

```bash
# 1. Clonar el repo
git clone https://github.com/fpobletemu/agendamientoapp.git

# 2. Instalar dependencias
npm install

# 3. Copiar plantilla de variables
cp .env.example .env.local

# 4. Completar .env.local con las keys del proyecto Supabase

# 5. Levantar el servidor
npm run dev
```
