import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateBusiness } from '@/lib/actions/businesses'

export const metadata = { title: 'Configuración' }

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: business }, { data: businesses }, { data: profile }] = await Promise.all([
    supabase.from('businesses').select('*').eq('slug', businessSlug).single(),
    supabase.from('businesses').select('id, name, slug').eq('owner_id', user.id).eq('is_active', true),
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
  ])

  if (!business) redirect('/dashboard')

  const profileData = profile as { full_name: string | null } | null
  const updateWithId = updateBusiness.bind(null, business.id)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        businesses={businesses ?? []}
        currentSlug={businessSlug}
        userEmail={user.email ?? ''}
        userName={profileData?.full_name ?? undefined}
      />
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" /> Configuración
          </h1>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del negocio</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateWithId as unknown as (fd: FormData) => void} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del negocio</Label>
                  <Input id="name" name="name" defaultValue={business.name} required />
                </div>
                <div className="space-y-2">
                  <Label>URL pública</Label>
                  <div className="flex items-center gap-1 rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                    agendamientos.app/{business.slug}
                  </div>
                  <p className="text-xs text-muted-foreground">El slug no se puede cambiar una vez creado</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <Input id="timezone" name="timezone" defaultValue={business.timezone} />
                </div>
                <Button type="submit">Guardar cambios</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
