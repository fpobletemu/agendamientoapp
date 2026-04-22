import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BranchesClient } from '@/components/branches/branches-client'
import { GitBranch } from 'lucide-react'

export const metadata = { title: 'Sucursales' }

export default async function BranchesPage({
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

  const { data: branches } = await supabase
    .from('branches')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: true })

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <GitBranch className="h-6 w-6" /> Sucursales
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {branches?.length ?? 0} sucursal{(branches?.length ?? 0) !== 1 ? 'es' : ''} registrada{(branches?.length ?? 0) !== 1 ? 's' : ''}
              </p>
            </div>
            <BranchesClient
              businessId={business.id}
              businessSlug={businessSlug}
              mode="create"
            />
          </div>

          <div className="grid gap-4">
            {branches?.map(branch => (
              <Card key={branch.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{branch.name}</CardTitle>
                      {branch.address && (
                        <CardDescription>{branch.address}</CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                        {branch.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                      <BranchesClient
                        businessId={business.id}
                        businessSlug={businessSlug}
                        branch={branch}
                        mode="edit"
                      />
                    </div>
                  </div>
                </CardHeader>
                {(branch.phone || branch.email) && (
                  <CardContent className="pt-0 text-sm text-muted-foreground flex gap-4">
                    {branch.phone && <span>📞 {branch.phone}</span>}
                    {branch.email && <span>✉️ {branch.email}</span>}
                  </CardContent>
                )}
              </Card>
            ))}

            {(!branches || branches.length === 0) && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <GitBranch className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="font-medium">Sin sucursales aún</p>
                  <p className="text-sm text-muted-foreground">Crea tu primera sucursal para empezar</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
