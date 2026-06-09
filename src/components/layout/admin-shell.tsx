'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Bell, Menu, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, initials } from '@/lib/utils'
import { CommandPalette } from '@/components/command/command-palette'
import { useSession } from '@/core/auth/session-client'
import { userRoleLabel } from '@/core/domain/labels'
import { logoutAction } from '@/app/actions/auth'
import { AdminSidebar, adminBottomNav } from '@/components/layout/admin-sidebar'

const STORAGE_COLLAPSED = 'pflegenest-admin-sidebar-collapsed'

export function AdminShell({
  children,
  notificationCount = 0,
}: {
  children: React.ReactNode
  notificationCount?: number
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_COLLAPSED)
      if (stored === 'true') setSidebarCollapsed(true)
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_COLLAPSED, String(sidebarCollapsed))
    } catch {
      // ignore
    }
  }, [sidebarCollapsed, hydrated])

  const closeMobileSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex min-h-dvh bg-muted/20">
      {/* Desktop sidebar */}
      <div className={cn('hidden lg:block shrink-0', !hydrated && 'w-[260px]')}>
        <div className="fixed inset-y-0 left-0 z-40 hidden lg:flex">
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />
        </div>
      </div>

      {/* Spacer matching sidebar width so main content doesn't sit under fixed sidebar */}
      <div
        className={cn(
          'hidden lg:block shrink-0 transition-[width] duration-300 ease-out',
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        )}
        aria-hidden
      />

      {/* Mobile drawer */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={closeMobileSidebar} />
          <div className="relative z-10 animate-fade-in shadow-2xl">
            <AdminSidebar
              collapsed={false}
              onCollapsedChange={() => {}}
              onNavigate={closeMobileSidebar}
              showCollapseToggle={false}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/85 backdrop-blur px-3 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Navigation öffnen"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center gap-2 max-w-md">
            <CommandTrigger />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/admin/notifications"
              aria-label={`Benachrichtigungen (${notificationCount})`}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-destructive-foreground">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              ) : null}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted" aria-label="Benutzermenü">
                  <Avatar>
                    <AvatarFallback>{session?.user ? initials(session.user.name) : '?'}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-sm font-medium">{session?.user?.name ?? 'Gast'}</span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user ? userRoleLabel[session.user.role] : 'Nicht angemeldet'}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push('/admin/settings/profile')}>Profil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/admin/settings')}>Einstellungen</DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={logoutAction}>
                  <button type="submit" className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                    Abmelden
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-3 sm:px-6 py-6 pb-24 lg:pb-6 min-w-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur" aria-label="Bottom Navigation">
          <div className="grid grid-cols-5">
            {adminBottomNav.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 py-2 text-[11px]',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <CommandPalette />
      </div>
    </div>
  )
}

function CommandTrigger() {
  return (
    <button
      onClick={() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
      }}
      className="flex flex-1 items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Suchen oder Befehl…</span>
      <span className="sm:hidden">Suche</span>
      <kbd className="ml-auto rounded bg-background border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
    </button>
  )
}
