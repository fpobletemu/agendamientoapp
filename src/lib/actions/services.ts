'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createService(businessId: string, businessSlug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const name = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string)?.trim() || null
  const duration_min = parseInt(formData.get('duration_min') as string) || 30
  const price = parseFloat(formData.get('price') as string) || 0
  const color = (formData.get('color') as string) || '#6366f1'

  if (!name) return { error: 'El nombre es requerido' }

  const { error } = await supabase.from('services').insert({
    business_id: businessId,
    name,
    description,
    duration_min,
    price,
    color,
  })

  if (error) return { error: 'Error al crear el servicio.' }

  revalidatePath(`/dashboard/${businessSlug}/services`)
  return { success: true }
}

export async function updateService(serviceId: string, businessSlug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const name = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string)?.trim() || null
  const duration_min = parseInt(formData.get('duration_min') as string) || 30
  const price = parseFloat(formData.get('price') as string) || 0
  const color = (formData.get('color') as string) || '#6366f1'
  const is_active = formData.get('is_active') !== 'false'

  const { error } = await supabase.from('services')
    .update({ name, description, duration_min, price, color, is_active })
    .eq('id', serviceId)

  if (error) return { error: 'Error al actualizar el servicio.' }

  revalidatePath(`/dashboard/${businessSlug}/services`)
  return { success: true }
}

export async function toggleService(serviceId: string, isActive: boolean, businessSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { error } = await supabase.from('services')
    .update({ is_active: isActive })
    .eq('id', serviceId)

  if (error) return { error: 'Error al actualizar el servicio.' }

  revalidatePath(`/dashboard/${businessSlug}/services`)
  return { success: true }
}
