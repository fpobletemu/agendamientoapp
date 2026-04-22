import { CreateBusinessForm } from '@/components/businesses/create-business-form'

export const metadata = { title: 'Crear tu negocio' }

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Crea tu negocio</h1>
          <p className="text-muted-foreground text-sm">
            Configura tu negocio para empezar a recibir citas. Puedes cambiar estos datos después.
          </p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm bg-card">
          <CreateBusinessForm />
        </div>
      </div>
    </div>
  )
}
