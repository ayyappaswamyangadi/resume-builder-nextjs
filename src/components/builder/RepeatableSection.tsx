"use client"

import * as React from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SortableItemRow } from "@/components/builder/SortableItemRow"
import { ItemFormDialog } from "@/components/builder/forms/ItemFormDialog"
import type { SectionConfig } from "@/types/section-config"

export function RepeatableSection<T extends { id: string }>({
  config,
  items,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: {
  config: SectionConfig<T>
  items: T[]
  onAdd: (item: T) => void
  onUpdate: (item: T) => void
  onRemove: (id: string) => void
  onReorder: (items: T[]) => void
}) {
  const [editing, setEditing] = React.useState<{ item: T; isNew: boolean } | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(items, oldIndex, newIndex))
  }

  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-sm text-muted-foreground">{config.emptyLabel}</p>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {items.map((item) => {
              const s = config.summary(item)
              return (
                <SortableItemRow
                  key={item.id}
                  id={item.id}
                  title={s.title}
                  subtitle={s.subtitle}
                  meta={s.meta}
                  onEdit={() => setEditing({ item, isNew: false })}
                  onDelete={() => onRemove(item.id)}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" size="sm" onClick={() => setEditing({ item: config.createEmpty(), isNew: true })}>
        <Plus className="size-4" aria-hidden="true" />
        Add {config.title.toLowerCase()}
      </Button>

      <ItemFormDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        config={config}
        item={editing?.item ?? null}
        isNew={editing?.isNew ?? false}
        onSubmit={(value) => (editing?.isNew ? onAdd(value) : onUpdate(value))}
      />
    </div>
  )
}
