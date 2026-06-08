'use client'

import { useRef, useState, useTransition } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadDocumentAction } from '@/app/actions/documents'
import { documentCategoryLabel } from '@/core/domain/labels'
import type { DocumentCategory } from '@/core/types'

export function DocumentUpload({ patientId, applicantId, employeeId }: { patientId?: string; applicantId?: string; employeeId?: string }) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<DocumentCategory>('patient_record')
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, start] = useTransition()

  function submit() {
    const file = fileRef.current?.files?.[0]
    if (!file) {
      toast.error('Bitte Datei wählen.')
      return
    }
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', category)
    if (patientId) fd.append('patientId', patientId)
    if (applicantId) fd.append('applicantId', applicantId)
    if (employeeId) fd.append('employeeId', employeeId)
    start(async () => {
      const res = await uploadDocumentAction(fd)
      if (!res.ok) toast.error(res.error ?? 'Upload fehlgeschlagen')
      else { toast.success('Hochgeladen'); setOpen(false); if (fileRef.current) fileRef.current.value = '' }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Upload className="h-4 w-4" /> Dokument hochladen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Dokument hochladen</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Datei (PDF, JPG, PNG, DOCX, max 10 MB)</Label>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.txt" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <Label>Kategorie</Label>
            <Select value={category} onValueChange={(v: DocumentCategory) => setCategory(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(documentCategoryLabel) as DocumentCategory[]).map(k => <SelectItem key={k} value={k}>{documentCategoryLabel[k]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button onClick={submit} disabled={pending}>{pending ? 'Hochladen…' : 'Hochladen'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
