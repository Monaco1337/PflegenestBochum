'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { deleteUserAction } from '@/app/actions/users'

export function UserDeleteButton({ userId, name, disabled }: { userId: string; name: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-muted-foreground hover:text-red-600"
          disabled={disabled}
          onClick={e => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Löschen</span>
        </Button>
      </DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Account löschen</DialogTitle>
          <DialogDescription>
            Möchten Sie den Account von <span className="font-medium text-foreground">{name}</span> wirklich löschen?
            Der Zugang wird sofort entzogen.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await deleteUserAction(userId)
                if (!res.ok) toast.error(res.error ?? 'Löschen fehlgeschlagen')
                else {
                  toast.success('Account gelöscht')
                  setOpen(false)
                }
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
