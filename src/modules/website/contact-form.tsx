'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { contactFormSchema, type ContactFormValues } from '@/core/validation/schemas'
import { submitContactForm } from '@/app/actions/leads'
import { CheckCircle2, Lock, Send } from 'lucide-react'

export function ContactForm() {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState, reset, watch, setValue } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', zip: '', city: '', message: '', consent: undefined as never },
  })

  const onSubmit = handleSubmit(async values => {
    const res = await submitContactForm(values)
    if (!res.ok) {
      toast.error(res.error ?? 'Konnte nicht senden.')
      return
    }
    toast.success('Danke! Wir melden uns innerhalb von 24 Stunden.')
    setSuccess(true)
    reset()
  })

  if (success) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(27,63,95,0.18)] sm:p-8">
        <div className="flex items-center gap-2 text-[#1B3F5F]">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-bold">Anfrage gesendet</h3>
        </div>
        <p className="mt-2 text-sm text-slate-600">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
        <Button
          variant="outline"
          onClick={() => setSuccess(false)}
          className="mt-5 h-11 rounded-lg border-slate-300 bg-white px-6 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50"
        >
          Neue Anfrage
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(27,63,95,0.18)] sm:p-8">
      <h3 className="text-xl font-bold text-[#1B3F5F]">Beratung anfragen</h3>
      <p className="mt-1.5 text-sm text-slate-600">Wir melden uns persönlich – schnell, freundlich und ohne Druck.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-[#1B3F5F]">Vorname</Label>
            <Input id="firstName" placeholder="Ihr Vorname" {...register('firstName')} aria-invalid={!!formState.errors.firstName} />
            {formState.errors.firstName ? <p className="text-xs text-destructive">{formState.errors.firstName.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-[#1B3F5F]">Nachname</Label>
            <Input id="lastName" placeholder="Ihr Nachname" {...register('lastName')} aria-invalid={!!formState.errors.lastName} />
            {formState.errors.lastName ? <p className="text-xs text-destructive">{formState.errors.lastName.message}</p> : null}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[#1B3F5F]">E-Mail</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="Ihre E-Mail-Adresse" {...register('email')} aria-invalid={!!formState.errors.email} />
            {formState.errors.email ? <p className="text-xs text-destructive">{formState.errors.email.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[#1B3F5F]">Telefon (optional)</Label>
            <Input id="phone" type="tel" autoComplete="tel" placeholder="Ihre Telefonnummer" {...register('phone')} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-[#1B3F5F]">Worum geht es?</Label>
          <Textarea id="message" rows={4} {...register('message')} placeholder="z.B. Pflegegrad-Beratung, Aufnahme, Verhinderungspflege …" aria-invalid={!!formState.errors.message} />
          {formState.errors.message ? <p className="text-xs text-destructive">{formState.errors.message.message}</p> : null}
        </div>
        <div className="flex items-start gap-2.5">
          <Checkbox id="consent" className="mt-0.5" checked={watch('consent') === true} onCheckedChange={v => setValue('consent', v === true ? true : (undefined as never), { shouldValidate: true })} />
          <Label htmlFor="consent" className="text-xs leading-relaxed text-slate-500">
            Ich habe die <a className="text-[#2563eb] underline" href="/datenschutz">Datenschutzhinweise</a> gelesen und stimme der Verarbeitung meiner Daten zur Kontaktaufnahme zu.
          </Label>
        </div>
        {formState.errors.consent ? <p className="text-xs text-destructive">{formState.errors.consent.message}</p> : null}

        <div className="flex flex-col-reverse items-start gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5" aria-hidden /> Sichere Übertragung Ihrer Daten
          </span>
          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="h-11 w-full rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352] sm:w-auto"
          >
            <Send className="h-4 w-4" />
            {formState.isSubmitting ? 'Wird gesendet…' : 'Anfrage senden'}
          </Button>
        </div>
      </form>
    </div>
  )
}
