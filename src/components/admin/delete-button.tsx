'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteEntityAction, type DeletableCollection } from '@/app/actions/entities'

export interface DeleteButtonProps {
  collection: DeletableCollection
  id: string
  /** Human label of the record shown in the confirmation. */
  name: string
  /** What kind of record this is, e.g. "Lead", "Aufgabe". */
  entityLabel?: string
  /** Visual style: a compact icon (default, for tables) or a labelled button. */
  variant?: 'icon' | 'labelled'
}

export function DeleteButton({ collection, id, name, entityLabel, variant = 'icon' }: DeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()
  const router = useRouter()

  const stop = (e: React.SyntheticEvent) => e.stopPropagation()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'labelled' ? (
          <Button
            size="sm"
            variant="outline"
            className="text-muted-foreground hover:text-red-600 hover:border-red-200"
            onClick={stop}
            onPointerDown={stop}
          >
            <Trash2 className="h-4 w-4" /> Löschen
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-muted-foreground hover:text-red-600"
            onClick={stop}
            onPointerDown={stop}
            aria-label="Löschen"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Löschen</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={stop}>
        <DialogHeader>
          <DialogTitle>{entityLabel ? `${entityLabel} löschen` : 'Eintrag löschen'}</DialogTitle>
          <DialogDescription>
            Möchten Sie <span className="font-medium text-foreground">{name}</span> wirklich löschen? Diese Aktion kann
            nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await deleteEntityAction(collection, id)
                if (!res.ok) {
                  toast.error(res.error ?? 'Löschen fehlgeschlagen')
                  return
                }
                toast.success(`${entityLabel ?? 'Eintrag'} gelöscht`)
                setOpen(false)
                router.refresh()
              })
            }
          >
            {pending ? 'Löscht…' : 'Endgültig löschen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
