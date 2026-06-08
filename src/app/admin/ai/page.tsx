import { aiService } from '@/core/services/ai'
import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Info } from 'lucide-react'
import { formatRelative } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'KI Command Center' }

export default async function AIPage() {
  await aiService().generateRecommendations()
  const recs = await repos.aiRecommendations.findMany(r => !r.acted)
  recs.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return (
    <>
      <PageHeader
        title="KI Command Center"
        description="Assistenzhinweise auf Basis aktueller Daten. Hinweise, keine Diagnosen — alle Entscheidungen werden von Menschen freigegeben."
      />
      <div className="rounded-lg border bg-primary/5 p-4 mb-6 text-sm flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 text-primary" />
        <div>
          Diese Hinweise dienen ausschließlich der Entscheidungsunterstützung. Sie ersetzen keine pflegefachliche oder medizinische Beurteilung.
          Mit gesetztem <code>OPENAI_API_KEY</code> oder <code>ANTHROPIC_API_KEY</code> kann die Heuristik durch einen LLM ersetzt werden — das Interface bleibt identisch.
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {recs.length === 0 ? <p className="text-sm text-muted-foreground col-span-3">Aktuell keine Hinweise.</p> : recs.map(r => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> {r.title}</CardTitle>
                <Badge variant={r.severity === 'critical' ? 'destructive' : r.severity === 'risk' ? 'warning' : 'muted'}>{r.severity}</Badge>
              </div>
              <CardDescription className="text-xs">Assistenzhinweis · {formatRelative(r.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {r.body}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
