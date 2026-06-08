import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import type { Shift, ShiftStatus, ShiftType, Tour, TourStatus, TourStop } from '@/core/types'

export interface CreateShiftInput {
  employeeId: string
  date: string
  startTime: string
  endTime: string
  type?: ShiftType
  status?: ShiftStatus
  tourId?: string
  note?: string
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m ?? 0)
}

async function detectShiftConflicts(shift: Shift): Promise<string[]> {
  const conflicts: string[] = []
  const sameDay = await repos.shifts.findMany(s => s.employeeId === shift.employeeId && s.date === shift.date && s.id !== shift.id)
  const a1 = timeToMinutes(shift.startTime)
  const a2 = timeToMinutes(shift.endTime)
  for (const other of sameDay) {
    const b1 = timeToMinutes(other.startTime)
    const b2 = timeToMinutes(other.endTime)
    if (a1 < b2 && b1 < a2) conflicts.push(`Überschneidung mit Schicht ${other.id}`)
  }

  const sickReports = await repos.sickReports.findMany(s => s.employeeId === shift.employeeId)
  for (const sr of sickReports) {
    const start = sr.startDate.slice(0, 10)
    const end = (sr.endDate ?? new Date(Date.now() + 86400_000 * 14).toISOString()).slice(0, 10)
    if (shift.date >= start && shift.date <= end) {
      conflicts.push('Mitarbeiter krankgemeldet')
    }
  }

  const vacations = await repos.vacationRequests.findMany(v => v.employeeId === shift.employeeId && v.status === 'approved')
  for (const v of vacations) {
    if (shift.date >= v.startDate.slice(0, 10) && shift.date <= v.endDate.slice(0, 10)) {
      conflicts.push('Mitarbeiter im Urlaub')
    }
  }
  return conflicts
}

export async function createShift(input: CreateShiftInput, actorId?: string): Promise<Shift> {
  let created = (await repos.shifts.create({
    employeeId: input.employeeId,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    type: input.type ?? 'day',
    status: input.status ?? 'planned',
    tourId: input.tourId,
    note: input.note,
    conflicts: [],
  })) as Shift
  const conflicts = await detectShiftConflicts(created)
  if (conflicts.length) {
    created = (await repos.shifts.update(created.id, { conflicts })) as Shift
    await eventBus.emit('shift.conflict_detected', { shiftId: created.id, conflicts }, { actorId })
  }
  await eventBus.emit('shift.created', { shiftId: created.id, status: created.status }, { actorId })
  return created
}

export async function moveShift(id: string, patch: Partial<Pick<Shift, 'date' | 'startTime' | 'endTime' | 'employeeId' | 'status' | 'tourId'>>, actorId?: string): Promise<Shift> {
  let updated = (await repos.shifts.update(id, patch)) as Shift
  const conflicts = await detectShiftConflicts(updated)
  updated = (await repos.shifts.update(id, { conflicts })) as Shift
  if (conflicts.length) {
    await eventBus.emit('shift.conflict_detected', { shiftId: updated.id, conflicts }, { actorId })
  }
  return updated
}

export interface CreateTourInput {
  name: string
  date: string
  startTime: string
  endTime?: string
  employeeId?: string
  notes?: string
  stops?: Array<Omit<TourStop, 'id' | 'tourId' | 'completedAt'>>
}

async function detectTourConflicts(tour: Tour, stops: TourStop[]): Promise<string[]> {
  const conflicts: string[] = []
  const sortedStops = [...stops].sort((a, b) => a.order - b.order)
  for (let i = 0; i < sortedStops.length - 1; i++) {
    const a = sortedStops[i]
    const b = sortedStops[i + 1]
    const aEnd = timeToMinutes(a.plannedAt) + a.durationMinutes
    const bStart = timeToMinutes(b.plannedAt)
    if (bStart < aEnd) conflicts.push(`Stop #${b.order} überlappt mit Stop #${a.order}`)
  }
  if (sortedStops.length > 0 && tour.endTime) {
    const last = sortedStops[sortedStops.length - 1]
    if (timeToMinutes(last.plannedAt) + last.durationMinutes > timeToMinutes(tour.endTime)) {
      conflicts.push('Tour läuft über die geplante Endzeit hinaus')
    }
  }
  if (tour.employeeId) {
    const sickReports = await repos.sickReports.findMany(s => s.employeeId === tour.employeeId)
    for (const sr of sickReports) {
      const start = sr.startDate.slice(0, 10)
      const end = (sr.endDate ?? new Date(Date.now() + 86400_000 * 14).toISOString()).slice(0, 10)
      if (tour.date >= start && tour.date <= end) {
        conflicts.push('Zugewiesener Mitarbeiter krankgemeldet')
      }
    }
  }
  return conflicts
}

export async function createTour(input: CreateTourInput, actorId?: string): Promise<{ tour: Tour; stops: TourStop[] }> {
  let tour = (await repos.tours.create({
    name: input.name,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    employeeId: input.employeeId,
    status: 'draft',
    conflicts: [],
    notes: input.notes,
  })) as Tour

  const stops: TourStop[] = []
  for (const [idx, stop] of (input.stops ?? []).entries()) {
    const s = (await repos.tourStops.create({
      tourId: tour.id,
      patientId: stop.patientId,
      order: stop.order ?? idx + 1,
      plannedAt: stop.plannedAt,
      durationMinutes: stop.durationMinutes ?? 30,
      serviceType: stop.serviceType,
      notes: stop.notes,
    })) as TourStop
    stops.push(s)
  }

  const conflicts = await detectTourConflicts(tour, stops)
  tour = (await repos.tours.update(tour.id, { conflicts, status: conflicts.length ? 'draft' : 'planned' })) as Tour
  if (conflicts.length) {
    await eventBus.emit('tour.optimization_needed', { tour, reason: conflicts.join(', ') }, { actorId })
  }
  await eventBus.emit('tour.created', { tour }, { actorId })
  return { tour, stops }
}

export async function updateTourStatus(id: string, status: TourStatus): Promise<Tour> {
  return repos.tours.update(id, { status }) as Promise<Tour>
}
