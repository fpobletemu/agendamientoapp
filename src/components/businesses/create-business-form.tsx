'use client'

import { useState, useTransition } from 'react'
import { createBusiness } from '@/lib/actions/businesses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const TIMEZONES = [
  { value: 'America/Santiago', label: 'Chile (Santiago)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (Buenos Aires)' },
  { value: 'America/Bogota', label: 'Colombia (Bogotá)' },
  { value: 'America/Lima', label: 'Perú (Lima)' },
  { value: 'America/Mexico_City', label: 'México (Ciudad de México)' },
]

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function CreateBusinessForm() {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [timezone, setTimezone] = useState('America/Santiago')
  const [error, setError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugEdited) setSlug(toSlug(value))
  }

  function handleSlugChange(value: string) {
    setSlug(toSlug(value))
    setSlugEdited(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createBusiness(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del negocio</Label>
        <Input
          id="name"
          name="name"
          placeholder="Mi Barbería"
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">
          URL de tu negocio
          <span className="text-muted-foreground font-normal ml-1 text-xs">(se auto-genera)</span>
        </Label>
        <div className="flex items-center gap-1 rounded-md border bg-muted px-3 text-sm">
          <span className="text-muted-foreground shrink-0">agendamientos.app/</span>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={e => handleSlugChange(e.target.value)}
            className="flex-1 bg-transparent py-2 outline-none min-w-0"
            placeholder="mi-barberia"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Zona horaria</Label>
        <Select name="timezone" value={timezone} onValueChange={(v) => v && setTimezone(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map(tz => (
              <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isPending || !slug}>
        {isPending ? 'Creando negocio...' : 'Crear negocio →'}
      </Button>
    </form>
  )
}
