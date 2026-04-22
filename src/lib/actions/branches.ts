'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createBranch(businessId: string, businessSlug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const name = (formData.get('name') as string).trim()
  const address = (formData.get('address') as string)?.trim() || null
  const phone = (formData.get('phone') as string)?.trim() || null
  const email = (formData.get('email') as string)?.trim() || null

  if (!name) return { error: 'El nombre es requerido' }

  const { error } = await supabase.from('branches').insert({
    business_id: businessId,
    name,
    address,
    phone,
    email,
  })

  if (error) return { error: 'Error al crear la sucursal.' }

  revalidatePath(`/dashboard/${businessSlug}/branches`)
  return { success: true }
}

export async function updateBranch(branchId: string, businessSlug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const name = (formData.get('name') as string).trim()
  const address = (formData.get('address') as string)?.trim() || null
  const phone = (formData.get('phone') as string)?.trim() || null
  const email = (formData.get('email') as string)?.trim() || null
  const isActive = formData.get('is_active') === 'true'

  const { error } = await supabase.from('branches')
    .update({ name, address, phone, email, is_active: isActive })
    .eq('id', branchId)

  if (error) return { error: 'Error al actualizar la sucursal.' }

  revalidatePath(`/dashboard/${businessSlug}/branches`)
  return { success: true }
}

export async function deleteBranch(branchId: string, businessSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { error } = await supabase.from('branches')
    .update({ is_active: false })
    .eq('id', branchId)

  if (error) return { error: 'Error al eliminar la sucursal.' }

  revalidatePath(`/dashboard/${businessSlug}/branches`)
  return { success: true }
}
