'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createBusiness(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const name = (formData.get('name') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const timezone = (formData.get('timezone') as string) || 'America/Santiago'

  if (!name || !slug) return { error: 'Nombre y slug son requeridos' }

  const { data: plan } = await supabase
    .from('subscription_plans').select('id').eq('name', 'free').single()

  const { data: business, error } = await supabase
    .from('businesses')
    .insert({ name, slug, timezone, owner_id: user.id, plan_id: plan?.id })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Ese slug ya está en uso. Elige otro.' }
    return { error: 'Error al crear el negocio. Intenta de nuevo.' }
  }

  // Usar admin client para bypass RLS al asignar roles iniciales
  const admin = createAdminClient()

  const { data: role } = await admin
    .from('roles').select('id').eq('name', 'BUSINESS_OWNER').single()

  await admin.from('user_access').insert({
    user_id: user.id,
    role_id: role!.id,
    business_id: business.id,
  })

  // Crear sucursal principal por defecto
  await admin.from('branches').insert({
    business_id: business.id,
    name: 'Sucursal principal',
  })

  revalidatePath('/dashboard')
  redirect(`/dashboard/${slug}/overview`)
}

export async function updateBusiness(businessId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const name = (formData.get('name') as string).trim()
  const timezone = formData.get('timezone') as string

  const { error } = await supabase
    .from('businesses')
    .update({ name, timezone })
    .eq('id', businessId)
    .eq('owner_id', user.id)

  if (error) return { error: 'Error al actualizar el negocio.' }

  revalidatePath('/dashboard')
  return { success: true }
}
