'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      setError('Error al enviar el email. Intenta de nuevo.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-2">
        <div className="text-4xl">📬</div>
        <h3 className="font-semibold">Revisa tu email</h3>
        <p className="text-sm text-muted-foreground">
          Si existe una cuenta con <strong>{email}</strong>, recibirás un link para restablecer tu contraseña.
        </p>
        <Link href="/auth/login" className="text-sm text-primary hover:underline block">
          Volver al login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Ingresa tu email y te enviaremos un link para restablecer tu contraseña.
      </p>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar link de recuperación'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/auth/login" className="text-primary hover:underline">
          Volver al login
        </Link>
      </p>
    </form>
  )
}
