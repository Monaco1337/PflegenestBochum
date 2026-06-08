'use client'

/**
 * Reusable Kanban board with @dnd-kit. Used by applicants pipeline and tasks.
 * - Mobile-friendly via PointerSensor + KeyboardSensor with sortable keyboard coordinates.
 * - Loose / dense visual modes.
 * - Optimistic UI; caller persists via server action.
 */

import { useMemo, useState, type ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

export interface KanbanColumn<TItem> {
  id: string
  title: string
  description?: string
  accent?: string
  items: TItem[]
}

export interface KanbanBoardProps<TItem extends { id: string }> {
  columns: KanbanColumn<TItem>[]
  renderItem: (item: TItem) => ReactNode
  onMove: (itemId: string, fromColumnId: string, toColumnId: string) => Promise<void> | void
  className?: string
  emptyHint?: string
}

interface InternalItem {
  id: string
  columnId: string
}

export function KanbanBoard<TItem extends { id: string }>({
  columns,
  renderItem,
  onMove,
  className,
  emptyHint = 'Hier hineinziehen',
}: KanbanBoardProps<TItem>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const [activeId, setActiveId] = useState<string | null>(null)
  const [columnsState, setColumnsState] = useState(columns)

  const indexedItems = useMemo<InternalItem[]>(
    () => columnsState.flatMap(col => col.items.map(item => ({ id: item.id, columnId: col.id }))),
    [columnsState]
  )

  const activeItem = useMemo(() => {
    if (!activeId) return null
    for (const col of columnsState) {
      const found = col.items.find(i => i.id === activeId)
      if (found) return found
    }
    return null
  }, [activeId, columnsState])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const activeRecord = indexedItems.find(i => i.id === active.id)
    if (!activeRecord) return

    // over.id can be an item id or a column id
    const overColumn = columnsState.find(c => c.id === over.id)
      ?? columnsState.find(c => c.items.some(i => i.id === over.id))
    if (!overColumn) return

    const fromCol = activeRecord.columnId
    const toCol = overColumn.id
    if (fromCol === toCol) return

    setColumnsState(prev => prev.map(col => {
      if (col.id === fromCol) {
        return { ...col, items: col.items.filter(i => i.id !== active.id) }
      }
      if (col.id === toCol) {
        const moved = columnsState.find(c => c.id === fromCol)?.items.find(i => i.id === active.id)
        if (!moved) return col
        return { ...col, items: [moved, ...col.items] }
      }
      return col
    }))

    try {
      await onMove(String(active.id), fromCol, toCol)
    } catch {
      // revert on error
      setColumnsState(columns)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={cn('flex gap-4 overflow-x-auto pb-3 snap-x', className)}>
        {columnsState.map(col => (
          <KanbanColumnView key={col.id} column={col} renderItem={renderItem} emptyHint={emptyHint} />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="rotate-1 scale-[1.02] shadow-2xl ring-2 ring-primary/40 rounded-lg">
            {renderItem(activeItem)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumnView<TItem extends { id: string }>({
  column,
  renderItem,
  emptyHint,
}: {
  column: KanbanColumn<TItem>
  renderItem: (item: TItem) => ReactNode
  emptyHint: string
}) {
  return (
    <section
      id={column.id}
      className="flex w-[280px] sm:w-[300px] shrink-0 flex-col rounded-xl border bg-card/60 snap-start"
      aria-label={column.title}
    >
      <header className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={cn('inline-block h-2 w-2 rounded-full', column.accent ?? 'bg-primary/70')} />
          <h3 className="text-sm font-medium">{column.title}</h3>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{column.items.length}</span>
      </header>
      <SortableContext items={column.items.map(i => i.id)} strategy={verticalListSortingStrategy} id={column.id}>
        <div className="flex flex-1 flex-col gap-2 p-2 min-h-[120px]" id={column.id}>
          {column.items.length === 0 ? (
            <div className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">{emptyHint}</div>
          ) : (
            column.items.map(item => (
              <KanbanItem key={item.id} id={item.id}>
                {renderItem(item)}
              </KanbanItem>
            ))
          )}
        </div>
      </SortableContext>
    </section>
  )
}

function KanbanItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab touch-none rounded-lg border bg-background/80 shadow-sm active:cursor-grabbing transition-shadow hover:shadow-md"
    >
      {children}
    </div>
  )
}
