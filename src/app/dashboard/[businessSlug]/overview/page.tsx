import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, Scissors, Users, GitBranch, ArrowRight } from 'lucide-react'

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: business }, { data: businesses }, { data: profile }] = await Promise.all([
    supabase.from('businesses').select('*, subscription_plans(name)').eq('slug', businessSlug).single(),
    supabase.from('businesses').select('id, name, slug').eq('owner_id', user.id).eq('is_active', true),
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
  ])

  if (!business) redirect('/dashboard')

  const [{ count: branchCount }, { count: serviceCount }, { count: staffCount }, { count: appointmentCount }] = await Promise.all([
    supabase.from('branches').select('*', { count: 'exact', head: true }).eq('business_id', business.id).eq('is_active', true),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('business_id', business.id).eq('is_active', true),
    supabase.from('staff_profiles').select('*', { count: 'exact', head: true }).in(
      'branch_id',
      (await supabase.from('branches').select('id').eq('business_id', business.id)).data?.map(b => b.id) ?? []
    ).eq('is_active', true),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).in(
      'branch_id',
      (await supabase.from('branches').select('id').eq('business_id', business.id)).data?.map(b => b.id) ?? []
    ).eq('status', 'pending'),
  ])

  const stats = [
    { label: 'Citas pendientes', value: appointmentCount ?? 0, icon: CalendarDays, href: `/dashboard/${businessSlug}/appointments`, color: 'text-blue-500' },
    { label: 'Servicios activos', value: serviceCount ?? 0, icon: Scissors, href: `/dashboard/${businessSlug}/services`, color: 'text-violet-500' },
    { label: 'Staff', value: staffCount ?? 0, icon: Users, href: `/dashboard/${businessSlug}/staff`, color: 'text-green-500' },
    { label: 'Sucursales', value: branchCount ?? 0, icon: GitBranch, href: `/dashboard/${businessSlug}/branches`, color: 'text-orange-500' },
  ]

  const profileData = profile as { full_name: string | null } | null
  const planName = (business as { subscription_plans?: { name: string } }).subscription_plans?.name ?? 'free'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        businesses={businesses ?? []}
        currentSlug={businessSlug}
        userEmail={user.email ?? ''}
        userName={profileData?.full_name ?? undefined}
      />
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <Badge variant="secondary" className="capitalize">{planName}</Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                Resumen general de tu negocio
              </p>
            </div>
            <Button asChild size="sm">
              <Link href={`/${businessSlug}`} target="_blank">
                Ver página pública <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, href, color }) => (
              <Link key={label} href={href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-3xl font-bold">{value}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick setup */}
          {(serviceCount === 0 || branchCount === 0) && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Completa tu configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {branchCount === 0 && (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">Configura tu sucursal</p>
                      <p className="text-xs text-muted-foreground">Agrega dirección y horario de atención</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/${businessSlug}/branches`}>Configurar</Link>
                    </Button>
                  </div>
                )}
                {serviceCount === 0 && (
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">Agrega tus servicios</p>
                      <p className="text-xs text-muted-foreground">Define qué ofreces, duración y precio</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/${businessSlug}/services`}>Agregar</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
