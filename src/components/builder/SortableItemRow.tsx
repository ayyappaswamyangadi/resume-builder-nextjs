"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SortableItemRow({
  id,
  title,
  subtitle,
  meta,
  onEdit,
  onDelete,
}: {
  id: string
  title: string
  subtitle?: string
  meta?: string
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-2"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-none text-muted-foreground hover:text-foreground"
        aria-label={`Reorder ${title}`}
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={onEdit} className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-medium">{title}</p>
        {(subtitle || meta) && (
          <p className="truncate text-xs text-muted-foreground">{[subtitle, meta].filter(Boolean).join(" · ")}</p>
        )}
      </button>
      <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label={`Edit ${title}`}>
        <Pencil className="size-3.5" aria-hidden="true" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onDelete} aria-label={`Delete ${title}`}>
        <Trash2 className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  )
}
