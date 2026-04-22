import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

export const metadata = { title: 'Staff' }

export default async function StaffPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: businesses }, { data: profile }] = await Promise.all([
    supabase.from('businesses').select('id, name, slug').eq('owner_id', user.id).eq('is_active', true),
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
  ])

  const profileData = profile as { full_name: string | null } | null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        businesses={businesses ?? []}
        currentSlug={businessSlug}
        userEmail={user.email ?? ''}
        userName={profileData?.full_name ?? undefined}
      />
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" /> Staff
          </h1>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-semibold text-lg">Gestión de staff</p>
              <p className="text-sm text-muted-foreground mt-1">
                Próximamente — invita a tu equipo y asigna servicios
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
