'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { File, Phone, Search, Sparkles, User, Users, Briefcase, ListTodo, Map, Calendar, FileText, Building, Stethoscope } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { searchAction } from '@/app/actions/search'
import type { SearchHit } from '@/core/search'

const iconByType: Record<SearchHit['type'], React.ReactNode> = {
  lead: <Phone className="h-4 w-4" />,
  patient: <User className="h-4 w-4" />,
  applicant: <Users className="h-4 w-4" />,
  employee: <Briefcase className="h-4 w-4" />,
  document: <File className="h-4 w-4" />,
  task: <ListTodo className="h-4 w-4" />,
  tour: <Map className="h-4 w-4" />,
  shift: <Calendar className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
  doctor: <Stethoscope className="h-4 w-4" />,
  insurance: <Building className="h-4 w-4" />,
  hospital: <Building className="h-4 w-4" />,
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (query.trim().length < 2) {
      setHits([])
      return
    }
    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const results = await searchAction(query)
        setHits(results)
      } finally {
        setLoading(false)
      }
    }, 180)
  }, [query])

  function go(href: string) {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  const quickActions: Array<{ id: string; label: string; href: string; icon: React.ReactNode }> = [
    { id: 'qa-1', label: 'Operations Wall öffnen', href: '/admin/ops', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'qa-2', label: 'Neue Aufgabe', href: '/admin/tasks?new=1', icon: <ListTodo className="h-4 w-4" /> },
    { id: 'qa-3', label: 'Neuen Lead anlegen', href: '/admin/crm/leads?new=1', icon: <Phone className="h-4 w-4" /> },
    { id: 'qa-4', label: 'Bewerber-Pipeline', href: '/admin/applicants', icon: <Users className="h-4 w-4" /> },
    { id: 'qa-5', label: 'Patienten', href: '/admin/patients', icon: <User className="h-4 w-4" /> },
    { id: 'qa-6', label: 'Touren', href: '/admin/tours', icon: <Map className="h-4 w-4" /> },
    { id: 'qa-7', label: 'Schichten', href: '/admin/shifts', icon: <Calendar className="h-4 w-4" /> },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden w-[min(96vw,640px)]">
        <DialogTitle className="sr-only">Globale Suche</DialogTitle>
        <Command shouldFilter={false} className="bg-transparent">
          <div className="flex items-center gap-2 border-b px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input
              autoFocus
              placeholder="Suchen: Patienten, Bewerber, Aufgaben, Dokumente…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              value={query}
              onValueChange={setQuery}
            />
            <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            {loading ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">Suche läuft…</div>
            ) : null}
            {hits.length === 0 && query.length < 2 ? (
              <Command.Group heading="Schnellzugriff" className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {quickActions.map(qa => (
                  <Command.Item
                    key={qa.id}
                    onSelect={() => go(qa.href)}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm aria-selected:bg-accent"
                  >
                    {qa.icon}
                    <span>{qa.label}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}
            {hits.length > 0 ? (
              <Command.Group heading="Ergebnisse" className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {hits.map(hit => (
                  <Command.Item
                    key={`${hit.type}-${hit.id}`}
                    value={`${hit.type}-${hit.id}-${hit.title}`}
                    onSelect={() => go(hit.href)}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm aria-selected:bg-accent"
                  >
                    <span className="text-muted-foreground">{iconByType[hit.type]}</span>
                    <span className="flex-1">{hit.title}</span>
                    <span className="text-xs text-muted-foreground">{hit.subtitle}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}
            {query.length >= 2 && hits.length === 0 && !loading ? (
              <Command.Empty className="px-3 py-6 text-center text-xs text-muted-foreground">
                Keine Treffer.
              </Command.Empty>
            ) : null}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
