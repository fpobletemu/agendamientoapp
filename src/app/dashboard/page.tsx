import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug')
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .limit(1)

  if (!businesses || businesses.length === 0) {
    redirect('/dashboard/onboarding')
  }

  redirect(`/dashboard/${businesses[0].slug}/overview`)
}
