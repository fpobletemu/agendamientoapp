-- Asigna rol SUPER_ADMIN al primer administrador de la plataforma
INSERT INTO public.user_access (user_id, role_id)
SELECT
  au.id,
  r.id
FROM auth.users au
CROSS JOIN public.roles r
WHERE au.email = 'f.pobletemu@gmail.com'
  AND r.name = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;
