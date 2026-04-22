'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays, LayoutDashboard, Scissors, Users, GitBranch, Settings, ChevronDown, LogOut, Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface Business {
  id: string
  name: string
  slug: string
}

interface SidebarProps {
  businesses: Business[]
  currentSlug?: string
  userEmail: string
  userName?: string
}

const navItems = (slug: string) => [
  { href: `/dashboard/${slug}/overview`, label: 'Resumen', icon: LayoutDashboard },
  { href: `/dashboard/${slug}/appointments`, label: 'Citas', icon: CalendarDays },
  { href: `/dashboard/${slug}/services`, label: 'Servicios', icon: Scissors },
  { href: `/dashboard/${slug}/staff`, label: 'Staff', icon: Users },
  { href: `/dashboard/${slug}/branches`, label: 'Sucursales', icon: GitBranch },
  { href: `/dashboard/${slug}/settings`, label: 'Configuración', icon: Settings },
]

function SidebarContent({ businesses, currentSlug, userEmail, userName }: SidebarProps) {
  const pathname = usePathname()
  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : userEmail[0].toUpperCase()

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Agendamientos</span>
        </Link>
      </div>

      {/* Business selector */}
      {businesses.length > 0 && currentSlug && (
        <div className="p-3 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="w-full justify-between font-medium" />}>
              <span className="truncate">
                {businesses.find(b => b.slug === currentSlug)?.name ?? 'Mi negocio'}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {businesses.map(b => (
                <DropdownMenuItem key={b.id} render={<Link href={`/dashboard/${b.slug}/overview`} />}>
                  {b.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/onboarding" />}>
                + Nuevo negocio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {currentSlug && navItems(currentSlug).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        {!currentSlug && (
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        )}
      </nav>

      {/* User */}
      <div className="p-3 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="w-full justify-start gap-3" />}>
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="truncate text-sm">{userName ?? userEmail}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form action="/auth/signout" method="POST">
                <button type="submit" className="flex items-center gap-2 w-full text-destructive">
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function Sidebar(props: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile */}
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50" />}>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent {...props} />
        </SheetContent>
      </Sheet>
    </>
  )
}
