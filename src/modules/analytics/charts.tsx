'use client'

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const palette = ['#2563eb', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

interface Props {
  leadSources: Array<{ source: string; value: number }>
  applicantStages: Array<{ stage: string; value: number }>
  funnel: { visits: number; leads: number; applicants: number; pflegegradCompletions: number; anamnesisCompletions: number; ctaClicks: number; callbackRequests: number }
}

export function AnalyticsCharts({ leadSources, applicantStages, funnel }: Props) {
  const funnelData = [
    { name: 'Seitenaufrufe', value: funnel.visits || 1 },
    { name: 'CTA-Klicks', value: funnel.ctaClicks },
    { name: 'Pflegegrad', value: funnel.pflegegradCompletions },
    { name: 'Anamnese', value: funnel.anamnesisCompletions },
    { name: 'Leads', value: funnel.leads },
  ]
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">Funnel</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer>
            <BarChart data={funnelData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {funnelData.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Leads nach Quelle</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer>
            <BarChart data={leadSources} layout="vertical" margin={{ top: 8, right: 8, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis type="number" fontSize={11} />
              <YAxis type="category" dataKey="source" fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {leadSources.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-base">Bewerber-Pipeline</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer>
            <BarChart data={applicantStages} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="stage" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {applicantStages.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
