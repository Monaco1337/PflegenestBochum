/**
 * Enterprise search index — fuzzy matches across all entities.
 * Rebuilt per query (cheap for in-memory data); for Prisma backend
 * this should be replaced by a Postgres tsvector index or Meilisearch.
 */
import Fuse from 'fuse.js'
import { repos } from '@/core/repositories'

export interface SearchHit {
  id: string
  type:
    | 'lead'
    | 'patient'
    | 'applicant'
    | 'employee'
    | 'document'
    | 'task'
    | 'tour'
    | 'shift'
    | 'note'
    | 'doctor'
    | 'insurance'
    | 'hospital'
  title: string
  subtitle?: string
  href: string
  score?: number
}

export async function globalSearch(term: string, limit = 20): Promise<SearchHit[]> {
  if (!term || term.trim().length < 2) return []

  const [
    leads,
    patients,
    applicants,
    employees,
    documents,
    tasks,
    tours,
    shifts,
    notes,
    doctors,
    insurances,
    hospitals,
  ] = await Promise.all([
    repos.leads.all(),
    repos.patients.all(),
    repos.applicants.all(),
    repos.employees.all(),
    repos.documents.all(),
    repos.tasks.all(),
    repos.tours.all(),
    repos.shifts.all(),
    repos.notes.all(),
    repos.doctors.all(),
    repos.insurances.all(),
    repos.hospitals.all(),
  ])

  const haystack: Array<SearchHit & { _searchText: string }> = [
    ...leads.map(l => ({
      id: l.id,
      type: 'lead' as const,
      title: `${l.firstName} ${l.lastName}`.trim(),
      subtitle: `Lead · ${l.status} · ${l.source}`,
      href: `/admin/crm/leads/${l.id}`,
      _searchText: `${l.firstName} ${l.lastName} ${l.email ?? ''} ${l.phone ?? ''} ${l.message ?? ''}`,
    })),
    ...patients.map(p => ({
      id: p.id,
      type: 'patient' as const,
      title: `${p.firstName} ${p.lastName}`.trim(),
      subtitle: `Patient · ${p.status} · ${p.careLevel.toUpperCase()}`,
      href: `/admin/patients/${p.id}`,
      _searchText: `${p.firstName} ${p.lastName} ${p.email ?? ''} ${p.phone ?? ''} ${p.city ?? ''} ${(p.diagnoses ?? []).join(' ')}`,
    })),
    ...applicants.map(a => ({
      id: a.id,
      type: 'applicant' as const,
      title: `${a.firstName} ${a.lastName}`.trim(),
      subtitle: `Bewerber · ${a.position} · ${a.stage}`,
      href: `/admin/applicants/${a.id}`,
      _searchText: `${a.firstName} ${a.lastName} ${a.email} ${a.position} ${a.qualifications.join(' ')}`,
    })),
    ...employees.map(e => ({
      id: e.id,
      type: 'employee' as const,
      title: `${e.firstName} ${e.lastName}`.trim(),
      subtitle: `Mitarbeiter · ${e.position}`,
      href: `/admin/employees/${e.id}`,
      _searchText: `${e.firstName} ${e.lastName} ${e.email} ${e.position} ${e.skills.join(' ')}`,
    })),
    ...documents.map(d => ({
      id: d.id,
      type: 'document' as const,
      title: d.name,
      subtitle: `Dokument · ${d.category}`,
      href: `/admin/documents?focus=${d.id}`,
      _searchText: `${d.name} ${d.category}`,
    })),
    ...tasks.map(t => ({
      id: t.id,
      type: 'task' as const,
      title: t.title,
      subtitle: `Aufgabe · ${t.status} · ${t.priority}`,
      href: `/admin/tasks?focus=${t.id}`,
      _searchText: `${t.title} ${t.description ?? ''} ${t.tags.join(' ')}`,
    })),
    ...tours.map(t => ({
      id: t.id,
      type: 'tour' as const,
      title: t.name,
      subtitle: `Tour · ${t.status} · ${t.date.slice(0, 10)}`,
      href: `/admin/tours/${t.id}`,
      _searchText: `${t.name} ${t.notes ?? ''}`,
    })),
    ...shifts.map(s => ({
      id: s.id,
      type: 'shift' as const,
      title: `Schicht ${s.type} · ${s.startTime}-${s.endTime}`,
      subtitle: `${s.date.slice(0, 10)} · ${s.status}`,
      href: `/admin/shifts?focus=${s.id}`,
      _searchText: `${s.type} ${s.startTime} ${s.endTime} ${s.note ?? ''}`,
    })),
    ...notes.map(n => ({
      id: n.id,
      type: 'note' as const,
      title: n.body.slice(0, 60),
      subtitle: 'Notiz',
      href: `/admin/notes/${n.id}`,
      _searchText: n.body,
    })),
    ...doctors.map(d => ({
      id: d.id,
      type: 'doctor' as const,
      title: `Dr. ${d.firstName} ${d.lastName}`,
      subtitle: `Arzt · ${d.specialty ?? ''}`,
      href: `/admin/crm/doctors/${d.id}`,
      _searchText: `${d.firstName} ${d.lastName} ${d.specialty ?? ''}`,
    })),
    ...insurances.map(i => ({
      id: i.id,
      type: 'insurance' as const,
      title: i.name,
      subtitle: 'Pflegekasse',
      href: `/admin/crm/insurances/${i.id}`,
      _searchText: `${i.name} ${i.code ?? ''}`,
    })),
    ...hospitals.map(h => ({
      id: h.id,
      type: 'hospital' as const,
      title: h.name,
      subtitle: 'Krankenhaus',
      href: `/admin/crm/hospitals/${h.id}`,
      _searchText: `${h.name} ${h.address ?? ''}`,
    })),
  ]

  const fuse = new Fuse(haystack, {
    keys: ['_searchText', 'title', 'subtitle'],
    threshold: 0.4,
    ignoreLocation: true,
  })

  return fuse
    .search(term)
    .slice(0, limit)
    .map(r => ({
      id: r.item.id,
      type: r.item.type,
      title: r.item.title,
      subtitle: r.item.subtitle,
      href: r.item.href,
      score: r.score,
    }))
}
