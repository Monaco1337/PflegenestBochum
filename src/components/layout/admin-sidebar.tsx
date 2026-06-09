'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BookText,
  Brain,
  Briefcase,
  Calendar,
  ChevronDown,
  Cog,
  FileText,
  LineChart,
  ListTodo,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Workflow,
} from 'lucide-react'
import { AdminLogo, LogoMark } from '@/components/brand/logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface NavSectionConfig {
  id: string
  title: string
  items: NavItem[]
}

const SECTIONS: NavSectionConfig[] = [
  {
    id: 'leitstand',
    title: 'Leitstand',
    items: [
      { href: '/admin/ops', label: 'Operations Wall', icon: Activity },
      { href: '/admin/twin', label: 'Digital Twin', icon: Sparkles },
      { href: '/admin/ai', label: 'KI Command Center', icon: Brain },
    ],
  },
  {
    id: 'arbeitsbereich',
    title: 'Arbeitsbereich',
    items: [
      { href: '/admin/tasks', label: 'Aufgaben', icon: ListTodo },
      { href: '/admin/patients', label: 'Patienten', icon: User },
      { href: '/admin/applicants', label: 'Bewerber', icon: Users },
      { href: '/admin/employees', label: 'Mitarbeiter', icon: Briefcase },
      { href: '/admin/documents', label: 'Dokumente', icon: FileText },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    items: [
      { href: '/admin/shifts', label: 'Schichten', icon: Calendar },
      { href: '/admin/tours', label: 'Touren', icon: Map },
    ],
  },
  {
    id: 'crm',
    title: 'CRM',
    items: [
      { href: '/admin/crm/leads', label: 'Leads', icon: BookText },
      { href: '/admin/crm/relatives', label: 'Angehörige', icon: Users },
      { href: '/admin/crm/doctors', label: 'Ärzte', icon: Users },
      { href: '/admin/crm/insurances', label: 'Pflegekassen', icon: Users },
      { href: '/admin/crm/hospitals', label: 'Krankenhäuser', icon: Users },
    ],
  },
  {
    id: 'system',
    title: 'System',
    items: [
      { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
      { href: '/admin/audit', label: 'Audit-Logs', icon: ShieldCheck },
      { href: '/admin/settings', label: 'Einstellungen', icon: Cog },
      { href: '/admin/settings/workflows', label: 'Workflows', icon: Workflow },
    ],
  },
]

const STORAGE_SECTIONS = 'pflegenest-admin-nav-sections'

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/')
}

function sectionHasActive(pathname: string, items: NavItem[]) {
  return items.some(item => isActive(pathname, item.href))
}

function readSectionState(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_SECTIONS)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function defaultSectionState(pathname: string): Record<string, boolean> {
  const stored = readSectionState()
  const next: Record<string, boolean> = {}
  for (const section of SECTIONS) {
    const storedValue = stored[section.id]
    next[section.id] = storedValue ?? sectionHasActive(pathname, section.items)
  }
  return next
}

export function AdminSidebar({
  collapsed,
  onCollapsedChange,
  onNavigate,
  className,
  showCollapseToggle = true,
}: {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  onNavigate?: () => void
  className?: string
  showCollapseToggle?: boolean
}) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => defaultSectionState(pathname))

  useEffect(() => {
    for (const section of SECTIONS) {
      if (sectionHasActive(pathname, section.items)) {
        setOpenSections(prev => ({ ...prev, [section.id]: true }))
      }
    }
  }, [pathname])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SECTIONS, JSON.stringify(openSections))
    } catch {
      // ignore quota / private mode
    }
  }, [openSections])

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex h-full shrink-0 flex-col border-r bg-card/95 backdrop-blur-sm transition-[width] duration-300 ease-out',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          className
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b transition-all duration-300',
            collapsed ? 'justify-center px-2' : 'justify-between gap-2 px-3'
          )}
        >
          <Link
            href="/admin/ops"
            onClick={onNavigate}
            className={cn('flex items-center', collapsed ? 'justify-center' : 'min-w-0')}
            aria-label="Operations Wall"
          >
            {collapsed ? <LogoMark size={28} /> : <AdminLogo size="sm" />}
          </Link>
          {showCollapseToggle && !collapsed ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => onCollapsedChange(true)}
              aria-label="Navigation einklappen"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          <div className={cn('space-y-1', collapsed ? 'px-2' : 'px-2')}>
            {SECTIONS.map((section, index) => (
              <NavSection
                key={section.id}
                section={section}
                pathname={pathname}
                collapsed={collapsed}
                open={openSections[section.id] ?? false}
                onToggle={() => toggleSection(section.id)}
                onNavigate={onNavigate}
                showDivider={collapsed && index > 0}
              />
            ))}
          </div>
        </div>

        {showCollapseToggle && collapsed ? (
          <div className="border-t p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mx-auto h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={() => onCollapsedChange(false)}
                  aria-label="Navigation ausklappen"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Navigation ausklappen</TooltipContent>
            </Tooltip>
          </div>
        ) : null}
      </aside>
    </TooltipProvider>
  )
}

function NavSection({
  section,
  pathname,
  collapsed,
  open,
  onToggle,
  onNavigate,
  showDivider,
}: {
  section: NavSectionConfig
  pathname: string
  collapsed: boolean
  open: boolean
  onToggle: () => void
  onNavigate?: () => void
  showDivider?: boolean
}) {
  const activeInSection = useMemo(() => sectionHasActive(pathname, section.items), [pathname, section.items])

  if (collapsed) {
    return (
      <div className="space-y-0.5">
        {showDivider ? <Separator className="my-2 bg-border/60" /> : null}
        <nav className="flex flex-col gap-0.5" aria-label={section.title}>
          {section.items.map(item => (
            <NavLink key={item.href} item={item} pathname={pathname} collapsed onNavigate={onNavigate} />
          ))}
        </nav>
      </div>
    )
  }

  return (
    <div className="px-1">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors',
          'hover:bg-muted/60',
          activeInSection && !open && 'text-primary'
        )}
        aria-expanded={open}
      >
        <span className="flex-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {section.title}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200',
            open ? 'rotate-0' : '-rotate-90'
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-200 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-70'
        )}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-0.5 pb-1.5 pl-1 pr-0.5 pt-0.5" aria-label={section.title}>
            {section.items.map(item => (
              <NavLink key={item.href} item={item} pathname={pathname} collapsed={false} onNavigate={onNavigate} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

function NavLink({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  collapsed: boolean
  onNavigate?: () => void
}) {
  const active = isActive(pathname, item.href)
  const Icon = item.icon

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'group relative flex items-center rounded-lg text-sm transition-all duration-150',
        collapsed ? 'justify-center px-2 py-2' : 'gap-2.5 px-2.5 py-2',
        active
          ? 'bg-primary/10 text-primary shadow-[inset_2px_0_0_0_hsl(var(--primary))]'
          : 'text-foreground/80 hover:bg-muted/70 hover:text-foreground'
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon
        className={cn(
          'shrink-0 transition-colors',
          collapsed ? 'h-[18px] w-[18px]' : 'h-4 w-4',
          active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
        )}
      />
      {!collapsed ? (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge ? <Badge variant="secondary">{item.badge}</Badge> : null}
        </>
      ) : null}
    </Link>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" className="font-medium">
        {item.label}
      </TooltipContent>
    </Tooltip>
  )
}

/** Bottom nav items for mobile — kept here so routes stay in sync with the sidebar. */
export const adminBottomNav: NavItem[] = [
  { href: '/admin/ops', label: 'Wall', icon: Activity },
  { href: '/admin/tasks', label: 'Aufgaben', icon: ListTodo },
  { href: '/admin/patients', label: 'Patienten', icon: User },
  { href: '/admin/applicants', label: 'Bewerber', icon: Users },
  { href: '/admin/ai', label: 'KI', icon: Brain },
]
