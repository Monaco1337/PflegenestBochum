/**
 * Demo data seed. Only runs when no data exists. Activated by DEMO_MODE
 * (auto-on when DATABASE_URL is unset). All seeded entities are clearly
 * demo personas — never confused with production data.
 */
import { repos } from '@/core/repositories'
import type {
  Applicant,
  Document,
  Employee,
  Lead,
  Patient,
  Task,
} from '@/core/types'

const now = () => new Date().toISOString()
const daysFromNow = (n: number) => new Date(Date.now() + n * 86400_000).toISOString()

export async function seedDemoData() {
  // Login accounts are seeded separately (see core/auth/seed-accounts.ts) so the
  // demo data below never adds extra users to the account list.
  const employeesData = [
    { firstName: 'Anna', lastName: 'Schulz', position: 'Pflegefachkraft', qualification: 'Examiniert', status: 'active' as const },
    { firstName: 'Mehmet', lastName: 'Yilmaz', position: 'Pflegehelfer', qualification: 'Pflegebasiskurs', status: 'active' as const },
    { firstName: 'Lisa', lastName: 'Werner', position: 'Pflegefachkraft', qualification: 'Examiniert', status: 'sick' as const },
    { firstName: 'Thomas', lastName: 'Krause', position: 'Pflegehelfer', qualification: 'Pflegebasiskurs', status: 'active' as const },
    { firstName: 'Olga', lastName: 'Petrowa', position: 'Pflegefachkraft', qualification: 'Examiniert', status: 'on_leave' as const },
    { firstName: 'Jonas', lastName: 'Bauer', position: 'Pflegehelfer', qualification: 'Pflegebasiskurs', status: 'active' as const },
  ]

  const employees: Employee[] = []
  for (const e of employeesData) {
    employees.push(
      (await repos.employees.create({
        firstName: e.firstName,
        lastName: e.lastName,
        email: `${e.firstName.toLowerCase()}.${e.lastName.toLowerCase()}@pflegenest-bochum.de`,
        position: e.position,
        qualification: e.qualification,
        employmentType: 'full_time',
        status: e.status,
        weeklyHours: 40,
        hireDate: daysFromNow(-365),
        driverLicense: true,
        vehicle: true,
        skills: ['Grundpflege', 'Behandlungspflege'],
        certifications: ['Erste Hilfe'],
        vacationDays: 28,
        vacationTakenDays: 10,
        overtimeHours: 5,
        active: true,
      })) as Employee
    )
  }

  await repos.sickReports.create({
    employeeId: employees[2].id,
    startDate: daysFromNow(-2),
    endDate: daysFromNow(3),
    note: 'Grippe',
  })

  const insuranceProviders = ['AOK Westfalen-Lippe', 'Techniker Krankenkasse', 'Barmer']
  const insurances = []
  for (const name of insuranceProviders) {
    insurances.push(await repos.insurances.create({ name, code: name.slice(0, 3).toUpperCase() }))
  }

  const doctorsData = [
    { firstName: 'Heinz', lastName: 'Maier', specialty: 'Allgemeinmedizin' },
    { firstName: 'Petra', lastName: 'Klein', specialty: 'Geriatrie' },
  ]
  const doctors = []
  for (const d of doctorsData) {
    doctors.push(await repos.doctors.create({ ...d, phone: '0234 1234567' }))
  }

  await repos.hospitals.create({ name: 'Klinikum Bochum', phone: '0234 5099-0', address: 'Hospitalstraße 19, 44791 Bochum' })

  const patientsData = [
    { firstName: 'Helmut', lastName: 'Schwarz', careLevel: 'pg3' as const, status: 'active' as const, risk: ['fall_risk'] },
    { firstName: 'Margarete', lastName: 'Vogel', careLevel: 'pg4' as const, status: 'active' as const, risk: ['dementia', 'fall_risk'] },
    { firstName: 'Wilhelm', lastName: 'Becker', careLevel: 'pg2' as const, status: 'active' as const, risk: [] },
    { firstName: 'Renate', lastName: 'Lange', careLevel: 'pg5' as const, status: 'active' as const, risk: ['bedridden', 'wounds'] },
    { firstName: 'Klaus', lastName: 'Wagner', careLevel: 'pg1' as const, status: 'prospect' as const, risk: [] },
  ]
  const patients: Patient[] = []
  for (const p of patientsData) {
    patients.push(
      (await repos.patients.create({
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: '1942-05-15',
        gender: 'm',
        street: 'Ruhrstraße 2',
        zip: '44869',
        city: 'Bochum',
        phone: '0234 1234567',
        status: p.status,
        careLevel: p.careLevel,
        insuranceId: insurances[0].id,
        primaryDoctorId: doctors[0].id,
        diagnoses: ['Diabetes mellitus Typ II', 'Hypertonie'],
        medications: [
          { id: 'm1', name: 'Metformin', dosage: '500mg', schedule: '1-0-1' },
          { id: 'm2', name: 'Ramipril', dosage: '5mg', schedule: '1-0-0' },
        ],
        riskFlags: p.risk,
      })) as Patient
    )
  }

  for (const patient of patients.slice(0, 3)) {
    await repos.relatives.create({
      firstName: 'Sabine',
      lastName: patient.lastName,
      relation: 'child',
      phone: '0234 7654321',
      email: `angehoerige.${patient.lastName.toLowerCase()}@example.com`,
      isPrimary: true,
      hasPortalAccess: false,
      patientId: patient.id,
    })
  }

  const leadsData = [
    { firstName: 'Maria', lastName: 'Hoffmann', source: 'website_contact' as const, status: 'new' as const },
    { firstName: 'Karl', lastName: 'Müller', source: 'pflegegrad_wizard' as const, status: 'contacted' as const },
    { firstName: 'Erika', lastName: 'Schneider', source: 'website_callback' as const, status: 'new' as const },
  ]
  const leads: Lead[] = []
  for (const l of leadsData) {
    leads.push(
      (await repos.leads.create({
        firstName: l.firstName,
        lastName: l.lastName,
        email: `${l.firstName.toLowerCase()}@example.com`,
        phone: '0173 9999999',
        source: l.source,
        status: l.status,
        priority: 'medium',
        consentGiven: true,
        message: 'Beratung gewünscht.',
      })) as Lead
    )
  }

  const applicantsData = [
    { firstName: 'Sarah', lastName: 'Klein', position: 'Pflegefachkraft', stage: 'new' as const, qualifications: ['Examiniert', '3 Jahre Erfahrung'] },
    { firstName: 'Tobias', lastName: 'Roth', position: 'Pflegehelfer', stage: 'phone_interview' as const, qualifications: ['Pflegebasiskurs'] },
    { firstName: 'Aylin', lastName: 'Demir', position: 'Pflegefachkraft', stage: 'onsite_interview' as const, qualifications: ['Examiniert', 'Wundmanagement'] },
    { firstName: 'Daniel', lastName: 'Voss', position: 'Pflegehelfer', stage: 'trial_day' as const, qualifications: ['Erste Hilfe'] },
    { firstName: 'Julia', lastName: 'Berg', position: 'Pflegefachkraft', stage: 'new' as const, qualifications: ['Examiniert'] },
  ]
  const applicants: Applicant[] = []
  for (const a of applicantsData) {
    applicants.push(
      (await repos.applicants.create({
        firstName: a.firstName,
        lastName: a.lastName,
        email: `${a.firstName.toLowerCase()}.${a.lastName.toLowerCase()}@example.com`,
        phone: '0151 1234567',
        position: a.position,
        stage: a.stage,
        score: 60 + a.qualifications.length * 10,
        source: 'career_page',
        motivation: 'Sehr motiviert, in der Pflege zu arbeiten.',
        qualifications: a.qualifications,
        consentGiven: true,
      })) as Applicant
    )
  }

  const tasksData: Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> = [
    {
      title: 'Rückruf: Maria Hoffmann',
      description: 'Erstgespräch vereinbaren.',
      status: 'open',
      kind: 'callback',
      priority: 'high',
      dueDate: daysFromNow(1),
      leadId: leads[0].id,
      tags: ['lead', 'rückruf'],
    },
    {
      title: 'Medikationsplan aktualisieren',
      description: 'Aktualisierter Plan von Hausarzt einholen.',
      status: 'in_progress',
      kind: 'task',
      priority: 'medium',
      dueDate: daysFromNow(3),
      patientId: patients[0].id,
      tags: ['medikation'],
    },
    {
      title: 'Bewerber:in Sarah Klein einladen',
      description: 'Telefoninterview vereinbaren.',
      status: 'open',
      kind: 'callback',
      priority: 'high',
      dueDate: daysFromNow(2),
      applicantId: applicants[0].id,
      tags: ['recruiting'],
    },
    {
      title: 'Pflegegutachten beantragen',
      description: 'Pflegegutachten für Klaus Wagner beantragen.',
      status: 'open',
      kind: 'task',
      priority: 'medium',
      dueDate: daysFromNow(7),
      patientId: patients[4].id,
      tags: ['pflegegrad'],
    },
    {
      title: 'Überfällig: Dokumentation prüfen',
      description: 'Wöchentliche Dokumentation prüfen.',
      status: 'open',
      kind: 'task',
      priority: 'urgent',
      dueDate: daysFromNow(-1),
      tags: ['qualität'],
    },
  ]
  for (const t of tasksData) await repos.tasks.create(t)

  const docs: Document[] = []
  docs.push(
    (await repos.documents.create({
      name: 'Pflegegutachten Helmut Schwarz.pdf',
      category: 'pflegegutachten',
      url: '#',
      size: 240_000,
      patientId: patients[0].id,
      expiresAt: daysFromNow(60),
    })) as Document
  )
  docs.push(
    (await repos.documents.create({
      name: 'Medikationsplan Margarete Vogel.pdf',
      category: 'medication_plan',
      url: '#',
      size: 80_000,
      patientId: patients[1].id,
      expiresAt: daysFromNow(15),
    })) as Document
  )
  docs.push(
    (await repos.documents.create({
      name: 'Bewerbung Sarah Klein.pdf',
      category: 'application',
      url: '#',
      size: 320_000,
      applicantId: applicants[0].id,
    })) as Document
  )

  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10)
  for (const e of employees.slice(0, 4)) {
    await repos.shifts.create({
      employeeId: e.id,
      date: dateStr,
      startTime: '07:00',
      endTime: '15:00',
      type: 'early',
      status: 'planned',
      conflicts: [],
    })
  }
  await repos.shifts.create({
    employeeId: employees[2].id,
    date: dateStr,
    startTime: '14:00',
    endTime: '22:00',
    type: 'late',
    status: 'substitute_needed',
    conflicts: ['Mitarbeiter krankgemeldet'],
  })

  const tour = await repos.tours.create({
    name: 'Tour Bochum-Mitte',
    date: dateStr,
    employeeId: employees[0].id,
    startTime: '07:00',
    endTime: '12:00',
    status: 'planned',
    conflicts: [],
    notes: 'Vormittagstour Bochum-Mitte',
  })
  for (const [i, p] of patients.slice(0, 3).entries()) {
    await repos.tourStops.create({
      tourId: tour.id,
      patientId: p.id,
      order: i + 1,
      plannedAt: `0${7 + i}:30`,
      durationMinutes: 30,
      serviceType: 'Grundpflege',
    })
  }

  await repos.riskSignals.create({
    patientId: patients[1].id,
    type: 'fall_risk',
    severity: 'risk',
    body: 'Sturzrisiko erhöht: Patientin ist demenziell verändert und mehrfach gestürzt.',
    resolved: false,
  })
  await repos.riskSignals.create({
    patientId: patients[3].id,
    type: 'wound',
    severity: 'attention',
    body: 'Wundstatus Sakralbereich kontrollieren.',
    resolved: false,
  })

  await repos.aiRecommendations.create({
    entity: 'global',
    title: 'Tagesfokus: Bewerbungen sichten',
    body: 'Es sind 2 neue Bewerbungen für Pflegefachkräfte eingegangen. Eine zeitnahe Erstkontaktaufnahme erhöht die Conversion deutlich.',
    severity: 'attention',
    acted: false,
    source: 'heuristic',
  })
}
