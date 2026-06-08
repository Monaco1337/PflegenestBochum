'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { callbackFormSchema, type CallbackFormValues } from '@/core/validation/schemas'
import { submitCallbackForm } from '@/app/actions/leads'
import { CheckCircle2 } from 'lucide-react'

export function CallbackForm() {
  const [done, setDone] = useState(false)
  const { register, handleSubmit, formState, reset, watch, setValue } = useForm<CallbackFormValues>({
    resolver: zodResolver(callbackFormSchema),
    defaultValues: { firstName: '', lastName: '', phone: '', preferredTime: '', consent: undefined as never },
  })

  const onSubmit = handleSubmit(async values => {
    const res = await submitCallbackForm(values)
    if (!res.ok) {
      toast.error(res.error ?? 'Konnte nicht senden.')
      return
    }
    toast.success('Wir rufen Sie zurück.')
    setDone(true)
    reset()
  })

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success"><CheckCircle2 className="h-5 w-5" /> Rückruf angefordert</CardTitle>
          <CardDescription>Wir melden uns zur gewünschten Zeit.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rückruf vereinbaren</CardTitle>
        <CardDescription>Sie hinterlassen Nummer + Zeitwunsch, wir rufen zurück.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={onSubmit} noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="cb-firstName">Vorname</Label>
              <Input id="cb-firstName" {...register('firstName')} />
              {formState.errors.firstName ? <p className="text-xs text-destructive">{formState.errors.firstName.message}</p> : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="cb-lastName">Nachname</Label>
              <Input id="cb-lastName" {...register('lastName')} />
              {formState.errors.lastName ? <p className="text-xs text-destructive">{formState.errors.lastName.message}</p> : null}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="cb-phone">Telefonnummer</Label>
              <Input id="cb-phone" type="tel" {...register('phone')} />
              {formState.errors.phone ? <p className="text-xs text-destructive">{formState.errors.phone.message}</p> : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="cb-pref">Zeitwunsch (optional)</Label>
              <Input id="cb-pref" placeholder="z.B. heute 14–16 Uhr" {...register('preferredTime')} />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="cb-consent" checked={watch('consent') === true} onCheckedChange={v => setValue('consent', v === true ? true : (undefined as never), { shouldValidate: true })} />
            <Label htmlFor="cb-consent" className="text-xs text-muted-foreground leading-relaxed">
              Ich stimme zu, telefonisch kontaktiert zu werden (<a className="underline" href="/datenschutz">Datenschutz</a>).
            </Label>
          </div>
          {formState.errors.consent ? <p className="text-xs text-destructive">{formState.errors.consent.message}</p> : null}
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Wird gesendet…' : 'Rückruf anfordern'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
