'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { createService, updateService } from '@/lib/actions/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Service {
  id: string
  name: string
  description: string | null
  duration_min: number
  price: number
  color: string
}

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
]

interface ServiceFormProps {
  businessId: string
  businessSlug: string
  service?: Service
  onSuccess?: () => void
}

export function ServiceForm({ businessId, businessSlug, service, onSuccess }: ServiceFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [color, setColor] = useState(service?.color ?? '#6366f1')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('color', color)

    startTransition(async () => {
      const result = service
        ? await updateService(service.id, businessSlug, formData)
        : await createService(businessId, businessSlug, formData)

      if (result?.error) {
        setError(result.error)
      } else {
        toast.success(service ? 'Servicio actualizado' : 'Servicio creado')
        onSuccess?.()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input id="name" name="name" defaultValue={service?.name} placeholder="Corte de cabello" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" defaultValue={service?.description ?? ''} placeholder="Descripción opcional del servicio" rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="duration_min">Duración (minutos)</Label>
          <Input id="duration_min" name="duration_min" type="number" min={5} step={5} defaultValue={service?.duration_min ?? 30} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Precio (CLP)</Label>
          <Input id="price" name="price" type="number" min={0} step={100} defaultValue={service?.price ?? 0} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color en agenda</Label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: c,
                borderColor: color === c ? '#000' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Guardando...' : service ? 'Guardar cambios' : 'Crear servicio'}
      </Button>
    </form>
  )
}
