'use client'

import { useCallback, useRef, useState } from 'react'
import { FileText, ImageIcon, Loader2, Trash2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { uploadAnamnesisDocumentAction } from '@/app/actions/anamnesis'
import { cn } from '@/lib/utils'

const MAX_BYTES = 10 * 1024 * 1024
const MAX_FILES = 10
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.txt'

type DocumentEntry = { name: string; url: string; size: number }

type UploadingFile = {
  id: string
  name: string
  size: number
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return ImageIcon
  return FileText
}

export function AnamnesisDocumentUpload({
  documents,
  onChange,
}: {
  documents: DocumentEntry[]
  onChange: (docs: DocumentEntry[] | ((prev: DocumentEntry[]) => DocumentEntry[])) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState<UploadingFile[]>([])

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name}: Datei ist zu groß (max. 10 MB).`)
        return
      }
      if (documents.length + uploading.length >= MAX_FILES) {
        toast.error(`Maximal ${MAX_FILES} Dokumente möglich.`)
        return
      }

      const id = `${file.name}-${Date.now()}`
      setUploading(prev => [...prev, { id, name: file.name, size: file.size }])

      const fd = new FormData()
      fd.append('file', file)

      try {
        const res = await uploadAnamnesisDocumentAction(fd)
        if (!res.ok || !res.data) {
          toast.error(res.error ?? `Upload fehlgeschlagen: ${file.name}`)
          return
        }
        const uploaded = res.data
        onChange(prev => [...prev, uploaded])
        toast.success(`${file.name} hochgeladen`)
      } catch {
        toast.error(`Upload fehlgeschlagen: ${file.name}`)
      } finally {
        setUploading(prev => prev.filter(f => f.id !== id))
      }
    },
    [documents.length, onChange, uploading.length]
  )

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files)
      if (documents.length + uploading.length + list.length > MAX_FILES) {
        toast.error(`Maximal ${MAX_FILES} Dokumente möglich.`)
        return
      }
      list.forEach(uploadFile)
    },
    [documents.length, uploadFile, uploading.length]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const removeDocument = (index: number) => {
    onChange(documents.filter((_, i) => i !== index))
  }

  const hasFiles = documents.length > 0 || uploading.length > 0

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-600">
        Laden Sie optional vorhandene Dokumente hoch — z. B. Pflegegutachten, Arztberichte oder Medikationspläne. Ihre
        Dateien werden verschlüsselt übertragen und sicher gespeichert.
      </p>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragEnter={e => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={e => {
          e.preventDefault()
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false)
        }}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'group relative cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200',
          dragging
            ? 'border-[#2563eb] bg-[#2563eb]/[0.06] shadow-[0_8px_30px_-12px_rgba(37,99,235,0.25)]'
            : 'border-slate-200/80 bg-slate-50/50 hover:border-[#2563eb]/40 hover:bg-[#2563eb]/[0.03]'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          onChange={e => {
            if (e.target.files?.length) handleFiles(e.target.files)
            e.target.value = ''
          }}
        />

        <span
          className={cn(
            'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
            dragging ? 'bg-[#2563eb] text-white' : 'bg-[#1B3F5F]/[0.06] text-[#2563eb] group-hover:bg-[#2563eb]/10'
          )}
        >
          <Upload className="h-6 w-6" aria-hidden />
        </span>

        <p className="mt-4 text-sm font-semibold text-[#1B3F5F]">
          {dragging ? 'Dateien hier ablegen' : 'Dokumente hierher ziehen oder klicken'}
        </p>
        <p className="mt-1.5 text-xs text-slate-500">PDF, JPG, PNG, DOC, DOCX, TXT · max. 10 MB pro Datei</p>
        <p className="mt-1 text-xs text-slate-400">Optional · bis zu {MAX_FILES} Dateien</p>
      </div>

      {hasFiles ? (
        <ul className="space-y-2">
          {uploading.map(file => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-xl border border-[#2563eb]/20 bg-[#2563eb]/[0.04] px-4 py-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563eb]">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#1B3F5F]">{file.name}</p>
                <p className="text-xs text-slate-500">Wird hochgeladen… · {formatBytes(file.size)}</p>
              </div>
            </li>
          ))}

          {documents.map((doc, idx) => {
            const Icon = fileIcon(doc.name)
            return (
              <li
                key={`${doc.url}-${idx}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.06] text-[#2563eb]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1B3F5F]">{doc.name}</p>
                  <p className="text-xs text-slate-500">{formatBytes(doc.size)} · Hochgeladen</p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 text-slate-400 hover:text-red-500"
                  aria-label={`${doc.name} entfernen`}
                  onClick={() => removeDocument(idx)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-center text-xs text-slate-400">Noch keine Dokumente hochgeladen — der Schritt ist optional.</p>
      )}

      {documents.length > 0 ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200/70 bg-emerald-50/50 px-4 py-2.5">
          <p className="text-xs font-medium text-emerald-800">
            {documents.length} {documents.length === 1 ? 'Dokument' : 'Dokumente'} bereit zur Übermittlung
          </p>
          <button
            type="button"
            onClick={() => onChange([])}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-red-500"
          >
            <X className="h-3 w-3" aria-hidden />
            Alle entfernen
          </button>
        </div>
      ) : null}
    </div>
  )
}
