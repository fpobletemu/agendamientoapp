'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BranchForm } from './branch-form'
import { Plus, Pencil } from 'lucide-react'

interface Branch {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
}

interface BranchesClientProps {
  businessId: string
  businessSlug: string
  branch?: Branch
  mode: 'create' | 'edit'
}

export function BranchesClient({ businessId, businessSlug, branch, mode }: BranchesClientProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === 'create' ? (
        <DialogTrigger render={<Button size="sm" />}>
          <Plus className="h-4 w-4 mr-1" /> Nueva sucursal
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
          <Pencil className="h-3.5 w-3.5" />
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nueva sucursal' : 'Editar sucursal'}</DialogTitle>
        </DialogHeader>
        <BranchForm
          businessId={businessId}
          businessSlug={businessSlug}
          branch={branch}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
