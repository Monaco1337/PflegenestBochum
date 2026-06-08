/**
 * Zod schemas — shared validation between forms and Server Actions.
 * Single source of truth for input shape and German error messages.
 */
import { z } from 'zod'

const requiredString = (label: string, min = 2) =>
  z
    .string({ required_error: `${label} ist erforderlich` })
    .trim()
    .min(min, `${label} ist zu kurz`)

const emailField = z
  .string({ required_error: 'E-Mail ist erforderlich' })
  .trim()
  .email('Bitte gültige E-Mail eingeben')

const phoneField = z
  .string()
  .trim()
  .regex(/^[+0-9 ()/\-]{5,}$/, 'Bitte gültige Telefonnummer eingeben')
  .optional()
  .or(z.literal(''))

export const contactFormSchema = z.object({
  firstName: requiredString('Vorname'),
  lastName: requiredString('Nachname'),
  email: emailField,
  phone: phoneField,
  zip: z.string().trim().optional(),
  city: z.string().trim().optional(),
  message: z.string().trim().min(5, 'Nachricht zu kurz').max(2000, 'Nachricht zu lang'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Bitte Datenschutzhinweis bestätigen' }),
  }),
})

export const callbackFormSchema = z.object({
  firstName: requiredString('Vorname'),
  lastName: requiredString('Nachname'),
  phone: requiredString('Telefonnummer', 5),
  preferredTime: z.string().trim().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Bitte Datenschutzhinweis bestätigen' }),
  }),
})

export const applicationFormSchema = z.object({
  firstName: requiredString('Vorname'),
  lastName: requiredString('Nachname'),
  email: emailField,
  phone: phoneField,
  city: z.string().trim().optional(),
  position: requiredString('Position'),
  qualification: z.string().trim().optional(),
  motivation: z.string().trim().max(4000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Bitte Datenschutzhinweis bestätigen' }),
  }),
})

export const loginFormSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Passwort erforderlich'),
})

export const taskFormSchema = z.object({
  title: requiredString('Titel', 3),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  kind: z.enum(['task', 'ticket', 'callback', 'reminder']),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  patientId: z.string().optional(),
  applicantId: z.string().optional(),
  employeeId: z.string().optional(),
  leadId: z.string().optional(),
})

export const patientFormSchema = z.object({
  firstName: requiredString('Vorname'),
  lastName: requiredString('Nachname'),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  street: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
  phone: phoneField,
  email: z.string().email('Ungültige E-Mail').optional().or(z.literal('')),
  status: z.enum(['prospect', 'active', 'paused', 'discharged', 'deceased']),
  careLevel: z.enum(['none', 'pg1', 'pg2', 'pg3', 'pg4', 'pg5']),
  notes: z.string().max(4000).optional(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
export type CallbackFormValues = z.infer<typeof callbackFormSchema>
export type ApplicationFormValues = z.infer<typeof applicationFormSchema>
export type LoginFormValues = z.infer<typeof loginFormSchema>
export type TaskFormValues = z.infer<typeof taskFormSchema>
export type PatientFormValues = z.infer<typeof patientFormSchema>
