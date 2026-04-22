import { RegisterForm } from '@/components/auth/register-form'

export const metadata = { title: 'Crear cuenta' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
          <p className="text-muted-foreground text-sm">
            Empieza a gestionar tus citas gratis
          </p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm bg-card">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
