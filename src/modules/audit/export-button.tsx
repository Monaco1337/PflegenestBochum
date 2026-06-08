'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AuditLog } from '@/core/types'

export function AuditExportButton({ data }: { data: AuditLog[] }) {
  function exportCsv() {
    const header = ['id', 'createdAt', 'action', 'entity', 'entityId', 'actorId', 'source']
    const escape = (v: unknown) => {
      const s = v == null ? '' : String(v)
      return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
    }
    const rows = data.map(d => header.map(h => escape((d as unknown as Record<string, unknown>)[h])).join(','))
    const csv = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <Button variant="outline" size="sm" onClick={exportCsv}>
      <Download className="h-4 w-4" /> CSV exportieren
    </Button>
  )
}
