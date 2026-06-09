'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { userRoleLabel } from '@/core/domain/labels'
import type { User } from '@/core/types'
import { UserFormDialog } from '@/modules/users/user-form-dialog'
import { UserDeleteButton } from '@/modules/users/user-delete-button'

export function UsersTable({
  data,
  currentUserId,
  canManage = false,
}: {
  data: User[]
  currentUserId?: string
  canManage?: boolean
}) {
  const cols: DataTableColumn<User>[] = [
    { id: 'name', header: 'Name', sortKey: 'name', cell: u => <span className="font-medium">{u.name}</span> },
    { id: 'username', header: 'Benutzername', sortKey: 'username', cell: u => <span className="font-mono text-xs">{u.username ?? '—'}</span> },
    { id: 'email', header: 'E-Mail', sortKey: 'email', cell: u => <span className="text-xs text-muted-foreground">{u.email}</span> },
    { id: 'role', header: 'Rolle', sortKey: 'role', cell: u => <Badge variant="info">{userRoleLabel[u.role]}</Badge> },
    { id: 'active', header: 'Aktiv', cell: u => u.active ? <Badge variant="success">Aktiv</Badge> : <Badge variant="muted">Inaktiv</Badge> },
    ...(canManage
      ? [{
          id: 'actions', header: 'Aktionen', cell: (u: User) => (
            <div className="flex items-center gap-1" onClick={ev => ev.stopPropagation()}>
              <UserFormDialog user={u} />
              <UserDeleteButton userId={u.id} name={u.name} disabled={u.id === currentUserId} />
            </div>
          ),
        } satisfies DataTableColumn<User>]
      : []),
  ]
  return <DataTable data={data} columns={cols} searchableFields={['name', 'email', 'username']} emptyTitle="Keine Benutzer" />
}
