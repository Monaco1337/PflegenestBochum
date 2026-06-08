import { repos } from '@/core/repositories'
import { getFunnel } from '@/core/services/analytics'
import { PageHeader } from '@/components/feedback/states'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsCharts } from '@/modules/analytics/charts'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const [funnel, leads, applicants] = await Promise.all([getFunnel(), repos.leads.all(), repos.applicants.all()])

  const leadsBySource: Record<string, number> = {}
  for (const l of leads) {
    leadsBySource[l.source] = (leadsBySource[l.source] ?? 0) + 1
  }
  const leadSourceData = Object.entries(leadsBySource).map(([source, value]) => ({ source, value }))

  const applicantsByStage: Record<string, number> = {}
  for (const a of applicants) {
    applicantsByStage[a.stage] = (applicantsByStage[a.stage] ?? 0) + 1
  }
  const applicantStageData = Object.entries(applicantsByStage).map(([stage, value]) => ({ stage, value }))

  return (
    <>
      <PageHeader title="Analytics" description="Reichweite, Leads, Bewerbungen, Funnels — DSGVO-freundlich, ohne Drittanbieter." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Kpi label="Leads (gesamt)" value={String(funnel.leads)} />
        <Kpi label="Bewerbungen" value={String(funnel.applicants)} />
        <Kpi label="Pflegegrad-Abschlüsse" value={String(funnel.pflegegradCompletions)} />
        <Kpi label="Anamnesen" value={String(funnel.anamnesisCompletions)} />
      </div>

      <AnalyticsCharts leadSources={leadSourceData} applicantStages={applicantStageData} funnel={funnel} />
    </>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  )
}
