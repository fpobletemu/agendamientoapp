import { LoginForm } from '@/components/auth/login-form'

export const metadata = { title: 'Iniciar sesión' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Bienvenido de vuelta</h1>
          <p className="text-muted-foreground text-sm">Ingresa a tu cuenta</p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm bg-card">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
