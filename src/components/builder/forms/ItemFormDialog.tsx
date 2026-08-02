"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GenericItemForm } from "@/components/builder/forms/GenericItemForm"
import type { SectionConfig } from "@/types/section-config"

export function ItemFormDialog<T extends { id: string }>({
  open,
  onOpenChange,
  config,
  item,
  isNew,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: SectionConfig<T>
  item: T | null
  isNew: boolean
  onSubmit: (item: T) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isNew ? `Add ${config.title.toLowerCase()}` : `Edit ${config.title.toLowerCase()}`}
          </DialogTitle>
        </DialogHeader>
        {item && (
          <GenericItemForm
            config={config}
            defaultItem={item}
            onSubmit={(value) => {
              onSubmit(value)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
