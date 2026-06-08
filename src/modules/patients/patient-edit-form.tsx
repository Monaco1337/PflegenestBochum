'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { patientFormSchema, type PatientFormValues } from '@/core/validation/schemas'
import { careLevelLabel, patientStatusLabel } from '@/core/domain/labels'
import { updatePatientAction } from '@/app/actions/patients'
import type { CareLevel, Patient, PatientStatus } from '@/core/types'

export function PatientEditForm({ patient }: { patient: Patient }) {
  const [pending, start] = useTransition()
  const { register, handleSubmit, formState, watch, setValue } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth ?? '',
      gender: patient.gender ?? '',
      street: patient.street ?? '',
      zip: patient.zip ?? '',
      city: patient.city ?? '',
      phone: patient.phone ?? '',
      email: patient.email ?? '',
      status: patient.status,
      careLevel: patient.careLevel,
      notes: patient.notes ?? '',
    },
  })

  const onSubmit = handleSubmit(values => {
    start(async () => {
      const res = await updatePatientAction(patient.id, values)
      if (!res.ok) toast.error(res.error ?? 'Fehler beim Speichern')
      else toast.success('Patient aktualisiert')
    })
  })

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <Field label="Vorname"><Input {...register('firstName')} /></Field>
      <Field label="Nachname"><Input {...register('lastName')} /></Field>
      <Field label="Geburtsdatum"><Input type="date" {...register('dateOfBirth')} /></Field>
      <Field label="Geschlecht">
        <Select value={watch('gender') ?? ''} onValueChange={v => setValue('gender', v)}>
          <SelectTrigger><SelectValue placeholder="bitte wählen" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="w">weiblich</SelectItem>
            <SelectItem value="m">männlich</SelectItem>
            <SelectItem value="d">divers</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <div className="sm:col-span-2"><Field label="Straße"><Input {...register('street')} /></Field></div>
      <Field label="PLZ"><Input {...register('zip')} /></Field>
      <Field label="Ort"><Input {...register('city')} /></Field>
      <Field label="Telefon"><Input type="tel" {...register('phone')} /></Field>
      <Field label="E-Mail"><Input type="email" {...register('email')} /></Field>
      <Field label="Status">
        <Select value={watch('status')} onValueChange={(v: PatientStatus) => setValue('status', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(patientStatusLabel) as PatientStatus[]).map(s => (
              <SelectItem key={s} value={s}>{patientStatusLabel[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Pflegegrad">
        <Select value={watch('careLevel')} onValueChange={(v: CareLevel) => setValue('careLevel', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(careLevelLabel) as CareLevel[]).map(cl => (
              <SelectItem key={cl} value={cl}>{careLevelLabel[cl]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Notizen"><Textarea rows={4} {...register('notes')} /></Field>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>{pending ? 'Speichert…' : 'Änderungen speichern'}</Button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}
