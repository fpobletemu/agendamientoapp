import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ServicesClient } from '@/components/services/services-client'
import { Scissors } from 'lucide-react'

export const metadata = { title: 'Servicios' }

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: business }, { data: businesses }, { data: profile }] = await Promise.all([
    supabase.from('businesses').select('id, name').eq('slug', businessSlug).single(),
    supabase.from('businesses').select('id, name, slug').eq('owner_id', user.id).eq('is_active', true),
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
  ])

  if (!business) redirect('/dashboard')

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('name', { ascending: true })

  const profileData = profile as { full_name: string | null } | null

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price)

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Scissors className="h-6 w-6" /> Servicios
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {services?.filter(s => s.is_active).length ?? 0} activo{(services?.filter(s => s.is_active).length ?? 0) !== 1 ? 's' : ''}
                {' '}de {services?.length ?? 0} total
              </p>
            </div>
            <ServicesClient businessId={business.id} businessSlug={businessSlug} mode="create" />
          </div>

          <div className="grid gap-3">
            {services?.map(service => (
              <Card key={service.id} className={service.is_active ? '' : 'opacity-60'}>
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full shrink-0"
                        style={{ backgroundColor: service.color }}
                      />
                      <div>
                        <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
                        {service.description && (
                          <CardDescription className="text-xs">{service.description}</CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">{formatPrice(service.price)}</p>
                        <p className="text-xs text-muted-foreground">{service.duration_min} min</p>
                      </div>
                      <Badge variant={service.is_active ? 'default' : 'secondary'} className="text-xs">
                        {service.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <div className="flex gap-1">
                        <ServicesClient businessId={business.id} businessSlug={businessSlug} service={service} mode="edit" />
                        <ServicesClient businessId={business.id} businessSlug={businessSlug} service={service} mode="toggle" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {(!services || services.length === 0) && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Scissors className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="font-medium">Sin servicios aún</p>
                  <p className="text-sm text-muted-foreground">Agrega los servicios que ofrece tu negocio</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
