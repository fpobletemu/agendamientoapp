import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">
          Hola, {profile?.full_name ?? user.email} 👋
        </h1>
        <p className="text-muted-foreground">
          Tu cuenta está lista. Pronto podrás configurar tu negocio desde aquí.
        </p>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-destructive underline"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
