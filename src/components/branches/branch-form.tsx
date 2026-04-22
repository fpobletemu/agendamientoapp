'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { createBranch, updateBranch } from '@/lib/actions/branches'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Branch {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
}

interface BranchFormProps {
  businessId: string
  businessSlug: string
  branch?: Branch
  onSuccess?: () => void
}

export function BranchForm({ businessId, businessSlug, branch, onSuccess }: BranchFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = branch
        ? await updateBranch(branch.id, businessSlug, formData)
        : await createBranch(businessId, businessSlug, formData)

      if (result?.error) {
        setError(result.error)
      } else {
        toast.success(branch ? 'Sucursal actualizada' : 'Sucursal creada')
        onSuccess?.()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input id="name" name="name" defaultValue={branch?.name} placeholder="Sucursal centro" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" name="address" defaultValue={branch?.address ?? ''} placeholder="Av. Principal 123" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" defaultValue={branch?.phone ?? ''} placeholder="+56 9 1234 5678" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={branch?.email ?? ''} placeholder="sucursal@email.com" />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Guardando...' : branch ? 'Guardar cambios' : 'Crear sucursal'}
      </Button>
    </form>
  )
}
