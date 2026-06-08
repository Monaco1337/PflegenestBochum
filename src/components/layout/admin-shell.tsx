'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Activity,
  Bell,
  Briefcase,
  Calendar,
  ChevronRight,
  Cog,
  FileText,
  Home,
  ListTodo,
  Map,
  Menu,
  Search,
  Sparkles,
  User,
  Users,
  Workflow,
  ShieldCheck,
  Brain,
  LineChart,
  BookText,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn, initials } from '@/lib/utils'
import { CommandPalette } from '@/components/command/command-palette'
import { useSession } from '@/core/auth/session-client'
import { userRoleLabel } from '@/core/domain/labels'
import { logoutAction } from '@/app/actions/auth'
import { AdminLogo } from '@/components/brand/logo'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const primary: NavItem[] = [
  { href: '/admin/ops', label: 'Operations Wall', icon: Activity },
  { href: '/admin/twin', label: 'Digital Twin', icon: Sparkles },
  { href: '/admin/ai', label: 'KI Command Center', icon: Brain },
]

const work: NavItem[] = [
  { href: '/admin/tasks', label: 'Aufgaben', icon: ListTodo },
  { href: '/admin/patients', label: 'Patienten', icon: User },
  { href: '/admin/applicants', label: 'Bewerber', icon: Users },
  { href: '/admin/employees', label: 'Mitarbeiter', icon: Briefcase },
  { href: '/admin/documents', label: 'Dokumente', icon: FileText },
]

const ops: NavItem[] = [
  { href: '/admin/shifts', label: 'Schichten', icon: Calendar },
  { href: '/admin/tours', label: 'Touren', icon: Map },
]

const sales: NavItem[] = [
  { href: '/admin/crm/leads', label: 'Leads', icon: BookText },
  { href: '/admin/crm/relatives', label: 'Angehörige', icon: Users },
  { href: '/admin/crm/doctors', label: 'Ärzte', icon: Users },
  { href: '/admin/crm/insurances', label: 'Pflegekassen', icon: Users },
  { href: '/admin/crm/hospitals', label: 'Krankenhäuser', icon: Users },
]

const meta: NavItem[] = [
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
  { href: '/admin/audit', label: 'Audit-Logs', icon: ShieldCheck },
  { href: '/admin/settings', label: 'Einstellungen', icon: Cog },
  { href: '/admin/settings/workflows', label: 'Workflows', icon: Workflow },
]

const bottomNav: NavItem[] = [
  { href: '/admin/ops', label: 'Wall', icon: Activity },
  { href: '/admin/tasks', label: 'Aufgaben', icon: ListTodo },
  { href: '/admin/patients', label: 'Patienten', icon: User },
  { href: '/admin/applicants', label: 'Bewerber', icon: Users },
  { href: '/admin/ai', label: 'KI', icon: Brain },
]

export function AdminShell({
  children,
  notificationCount = 0,
}: {
  children: React.ReactNode
  notificationCount?: number
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const session = useSession()
  const router = useRouter()

  function NavSection({ title, items }: { title: string; items: NavItem[] }) {
    return (
      <div className="px-2">
        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <nav className="flex flex-col gap-0.5">
          {items.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={cn('h-4 w-4 transition-colors', active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                <span className="flex-1">{item.label}</span>
                {item.badge ? <Badge variant="secondary">{item.badge}</Badge> : null}
              </Link>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh bg-muted/20">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r bg-card">
        <div className="flex h-16 items-center gap-2 px-4 border-b">
          <Link href="/admin/ops" className="flex items-center">
            <AdminLogo size="sm" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          <NavSection title="Leitstand" items={primary} />
          <NavSection title="Arbeitsbereich" items={work} />
          <NavSection title="Operations" items={ops} />
          <NavSection title="CRM" items={sales} />
          <NavSection title="System" items={meta} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 flex w-[260px] flex-col border-r bg-card shadow-2xl animate-fade-in">
            <div className="flex h-16 items-center gap-2 px-4 border-b">
              <Link href="/admin/ops" className="flex items-center" onClick={() => setSidebarOpen(false)}>
                <AdminLogo size="sm" showOsBadge={false} />
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-4">
              <NavSection title="Leitstand" items={primary} />
              <NavSection title="Arbeitsbereich" items={work} />
              <NavSection title="Operations" items={ops} />
              <NavSection title="CRM" items={sales} />
              <NavSection title="System" items={meta} />
            </div>
          </aside>
        </div>
      ) : null}

      <div className="flex-1 flex flex-col min-w-0">
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
            {bottomNav.map(item => {
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
