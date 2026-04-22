import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('slug', businessSlug)
    .eq('owner_id', user.id)
    .single()

  if (!business) notFound()

  return <>{children}</>
}
