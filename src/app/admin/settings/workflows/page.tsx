import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelative } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Workflows' }

export default async function WorkflowsPage() {
  const [workflows, runs] = await Promise.all([repos.workflows.all(), (await repos.workflowRuns.list({ limit: 20, sortBy: 'startedAt', sortDir: 'desc' })).data])
  return (
    <>
      <PageHeader title="Workflows" description="Konfigurierbare Automatisierungen mit Schritten und Audit-Trail." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Aktive Workflows</CardTitle><CardDescription>{workflows.filter(w => w.enabled).length} aktiviert</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {workflows.map(w => (
              <div key={w.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{w.name}</div>
                  <Badge variant={w.enabled ? 'success' : 'muted'}>{w.enabled ? 'aktiv' : 'inaktiv'}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Trigger: <code>{w.triggerKey}</code></div>
                <div className="text-xs text-muted-foreground mt-1">{w.description}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {w.steps.map(s => <Badge key={s.id} variant="muted">{s.kind}</Badge>)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Letzte Ausführungen</CardTitle></CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            {runs.length === 0 ? <p className="text-muted-foreground">Noch keine Ausführungen.</p> :
              runs.map(r => (
                <div key={r.id} className="flex items-center justify-between border-b py-1.5">
                  <span>Workflow {r.workflowId.slice(0, 6)}</span>
                  <span className="text-xs">
                    <Badge variant={r.status === 'succeeded' ? 'success' : r.status === 'failed' ? 'destructive' : 'muted'}>{r.status}</Badge>
                    <span className="ml-2 text-muted-foreground">{formatRelative(r.startedAt)}</span>
                  </span>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>
    </>
  )
}
