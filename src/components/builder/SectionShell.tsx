"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, GripVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function SectionShell({
  id,
  label,
  visible,
  collapsed,
  onToggleVisible,
  onToggleCollapsed,
  onDelete,
  pinned = false,
  children,
}: {
  id: string
  label: string
  visible: boolean
  collapsed: boolean
  onToggleVisible: () => void
  onToggleCollapsed: () => void
  onDelete?: () => void
  pinned?: boolean
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: pinned })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
      className="rounded-xl border bg-card"
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        {pinned ? (
          <span className="size-4" aria-hidden="true" />
        ) : (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="touch-none text-muted-foreground hover:text-foreground"
            aria-label={`Reorder ${label} section`}
          >
            <GripVertical className="size-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="flex flex-1 items-center gap-1.5 text-left font-medium"
          aria-expanded={!collapsed}
        >
          <ChevronDown className={cn("size-4 shrink-0 transition-transform", collapsed && "-rotate-90")} aria-hidden="true" />
          {label}
        </button>
        {onDelete && (
          <Button variant="ghost" size="icon-sm" onClick={onDelete} aria-label={`Delete ${label} section`}>
            <Trash2 className="size-3.5" aria-hidden="true" />
          </Button>
        )}
        {!pinned && (
          <Switch
            checked={visible}
            onCheckedChange={onToggleVisible}
            aria-label={visible ? `Hide ${label} section` : `Show ${label} section`}
          />
        )}
      </div>
      {!collapsed && <div className="border-t px-3 py-3">{children}</div>}
    </div>
  )
}
