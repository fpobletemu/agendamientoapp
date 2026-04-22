'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { toggleService } from '@/lib/actions/services'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ServiceForm } from './service-form'
import { Plus, Pencil, Power } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string | null
  duration_min: number
  price: number
  color: string
  is_active: boolean
}

interface ServicesClientProps {
  businessId: string
  businessSlug: string
  service?: Service
  mode: 'create' | 'edit' | 'toggle'
}

export function ServicesClient({ businessId, businessSlug, service, mode }: ServicesClientProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (mode === 'toggle' && service) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={isPending}
        onClick={() => startTransition(async () => {
          const result = await toggleService(service.id, !service.is_active, businessSlug)
          if (result?.error) toast.error(result.error)
          else toast.success(service.is_active ? 'Servicio desactivado' : 'Servicio activado')
        })}
      >
        <Power className="h-3.5 w-3.5" />
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === 'create' ? (
        <DialogTrigger render={<Button size="sm" />}>
          <Plus className="h-4 w-4 mr-1" /> Nuevo servicio
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
          <Pencil className="h-3.5 w-3.5" />
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo servicio' : 'Editar servicio'}</DialogTitle>
        </DialogHeader>
        <ServiceForm
          businessId={businessId}
          businessSlug={businessSlug}
          service={service}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
