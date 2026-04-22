import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata = { title: 'Recuperar contraseña' }

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
        </div>
        <div className="border rounded-xl p-6 shadow-sm bg-card">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
