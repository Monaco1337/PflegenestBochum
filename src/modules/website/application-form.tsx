'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { applicationFormSchema, type ApplicationFormValues } from '@/core/validation/schemas'
import { submitApplicationForm } from '@/app/actions/applicants'
import { CheckCircle2 } from 'lucide-react'

const positions = [
  'Pflegefachkraft',
  'Pflegehelfer:in',
  'Pflegedienstleitung',
  'Verwaltung',
  'Tourenplanung',
  'Praktikant:in',
]

export function ApplicationForm() {
  const [done, setDone] = useState(false)
  const { register, handleSubmit, formState, reset, setValue, watch } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', city: '', position: '', qualification: '', motivation: '', consent: undefined as never },
  })

  const onSubmit = handleSubmit(async values => {
    const res = await submitApplicationForm(values)
    if (!res.ok) {
      toast.error(res.error ?? 'Konnte nicht senden.')
      return
    }
    toast.success('Vielen Dank! Wir melden uns innerhalb von 48 Stunden.')
    setDone(true)
    reset()
  })

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success"><CheckCircle2 className="h-5 w-5" /> Bewerbung eingegangen</CardTitle>
          <CardDescription>Wir prüfen Ihre Bewerbung und kommen zeitnah auf Sie zu.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Online bewerben</CardTitle>
        <CardDescription>In 90 Sekunden bewerben — wir melden uns zurück.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Vorname *</Label>
              <Input {...register('firstName')} />
              {formState.errors.firstName ? <p className="text-xs text-destructive">{formState.errors.firstName.message}</p> : null}
            </div>
            <div className="space-y-1">
              <Label>Nachname *</Label>
              <Input {...register('lastName')} />
              {formState.errors.lastName ? <p className="text-xs text-destructive">{formState.errors.lastName.message}</p> : null}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>E-Mail *</Label>
              <Input type="email" {...register('email')} />
              {formState.errors.email ? <p className="text-xs text-destructive">{formState.errors.email.message}</p> : null}
            </div>
            <div className="space-y-1">
              <Label>Telefon</Label>
              <Input type="tel" {...register('phone')} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Position *</Label>
              <Select value={watch('position')} onValueChange={v => setValue('position', v, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="bitte wählen" /></SelectTrigger>
                <SelectContent>
                  {positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {formState.errors.position ? <p className="text-xs text-destructive">{formState.errors.position.message}</p> : null}
            </div>
            <div className="space-y-1">
              <Label>Qualifikation (optional)</Label>
              <Input placeholder="z.B. Examinierte Pflegefachkraft" {...register('qualification')} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Warum PflegeNest? (optional)</Label>
            <Textarea rows={4} {...register('motivation')} placeholder="Was möchten Sie über sich erzählen?" />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="ap-consent" checked={watch('consent') === true} onCheckedChange={v => setValue('consent', v === true ? true : (undefined as never), { shouldValidate: true })} />
            <Label htmlFor="ap-consent" className="text-xs text-muted-foreground leading-relaxed">
              Ich stimme der Verarbeitung meiner Bewerbungsdaten zu (<a href="/datenschutz" className="underline">Datenschutz</a>).
            </Label>
          </div>
          {formState.errors.consent ? <p className="text-xs text-destructive">{formState.errors.consent.message}</p> : null}
          <Button type="submit" size="lg" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Wird gesendet…' : 'Bewerbung absenden'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
