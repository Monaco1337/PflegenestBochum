'use client'

import { useMemo, useState } from 'react'
import { addDays, format, startOfWeek } from 'date-fns'
import { de } from 'date-fns/locale/de'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { shiftStatusLabel, shiftTypeLabel } from '@/core/domain/labels'
import type { Employee, Shift, ShiftType } from '@/core/types'

const shiftTypeAccent: Record<ShiftType, string> = {
  early: 'bg-blue-100 text-blue-700 border-blue-200',
  late: 'bg-amber-100 text-amber-800 border-amber-200',
  night: 'bg-slate-200 text-slate-700 border-slate-300',
  day: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  on_call: 'bg-violet-100 text-violet-700 border-violet-200',
}

export function ShiftsWeekView({ employees, shifts }: { employees: Employee[]; shifts: Shift[] }) {
  const [anchor, setAnchor] = useState(() => new Date())
  const start = startOfWeek(anchor, { weekStartsOn: 1 })
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(start, i)), [start])

  const employeesActive = employees.filter(e => e.active)
  const shiftsByEmpDay = useMemo(() => {
    const map = new Map<string, Shift[]>()
    for (const s of shifts) {
      const key = `${s.employeeId}#${s.date.slice(0, 10)}`
      const arr = map.get(key) ?? []
      arr.push(s)
      map.set(key, arr)
    }
    return map
  }, [shifts])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2">
          <CardTitle className="text-sm">Woche ab {format(start, 'd. MMMM yyyy', { locale: de })}</CardTitle>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => setAnchor(addDays(anchor, -7))} aria-label="Vorige Woche"><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={() => setAnchor(new Date())}>Heute</Button>
            <Button size="icon" variant="ghost" onClick={() => setAnchor(addDays(anchor, 7))} aria-label="Nächste Woche"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[180px_repeat(7,1fr)] border rounded-lg overflow-hidden">
              <div className="bg-muted/60 p-2 text-xs font-medium text-muted-foreground">Mitarbeiter</div>
              {days.map(d => (
                <div key={d.toISOString()} className="bg-muted/60 p-2 text-xs font-medium text-center">
                  {format(d, 'EEE d.MM', { locale: de })}
                </div>
              ))}
              {employeesActive.map((e, idx) => (
                <RowFragment key={e.id} employee={e} days={days} shiftsByEmpDay={shiftsByEmpDay} idx={idx} />
              ))}
              {employeesActive.length === 0 ? (
                <div className="col-span-8 p-6 text-center text-sm text-muted-foreground">Keine Mitarbeiter aktiv.</div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RowFragment({ employee, days, shiftsByEmpDay, idx }: { employee: Employee; days: Date[]; shiftsByEmpDay: Map<string, Shift[]>; idx: number }) {
  return (
    <>
      <div className={cn('p-2 text-sm border-t flex items-center gap-2', idx % 2 ? 'bg-card' : 'bg-muted/20')}>
        <div className="flex-1 min-w-0">
          <div className="truncate font-medium">{employee.firstName} {employee.lastName}</div>
          <div className="text-[11px] text-muted-foreground truncate">{employee.position}</div>
        </div>
        {employee.status === 'sick' ? <Badge variant="destructive">krank</Badge> : null}
      </div>
      {days.map(d => {
        const key = `${employee.id}#${d.toISOString().slice(0, 10)}`
        const dayShifts = shiftsByEmpDay.get(key) ?? []
        return (
          <div key={d.toISOString()} className={cn('p-2 border-t border-l text-xs space-y-1 min-h-[68px]', idx % 2 ? 'bg-card' : 'bg-muted/10')}>
            {dayShifts.length === 0 ? (
              <span className="text-[10px] text-muted-foreground/60">—</span>
            ) : dayShifts.map(s => (
              <div key={s.id} className={cn('rounded-md border px-2 py-1', shiftTypeAccent[s.type])}>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-medium">{shiftTypeLabel[s.type]}</span>
                  {s.conflicts.length > 0 ? <AlertTriangle className="h-3 w-3 text-destructive" /> : null}
                </div>
                <div className="text-[10px]">{s.startTime}–{s.endTime}</div>
                <div className="text-[10px] opacity-80">{shiftStatusLabel[s.status]}</div>
              </div>
            ))}
          </div>
        )
      })}
    </>
  )
}
