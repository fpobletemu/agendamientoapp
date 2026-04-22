import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Toaster } from '@/components/ui/sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: businesses }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('businesses').select('id, name, slug').eq('owner_id', user.id).eq('is_active', true),
  ])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        businesses={businesses ?? []}
        userEmail={user.email ?? ''}
        userName={(profile as { full_name: string | null } | null)?.full_name ?? undefined}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Toaster richColors position="top-right" />
    </div>
  )
}
