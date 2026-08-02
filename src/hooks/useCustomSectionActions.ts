"use client"

import { useResumeStore } from "@/store/resumeStore"

/** Binds the resume store's custom-section-item CRUD actions to one custom section id. */
export function useCustomSectionActions(sectionId: string) {
  const addCustomItem = useResumeStore((s) => s.addCustomItem)
  const updateCustomItem = useResumeStore((s) => s.updateCustomItem)
  const removeCustomItem = useResumeStore((s) => s.removeCustomItem)
  const reorderCustomItems = useResumeStore((s) => s.reorderCustomItems)

  return {
    onAdd: (item: Parameters<typeof addCustomItem>[1]) => addCustomItem(sectionId, item),
    onUpdate: (item: Parameters<typeof updateCustomItem>[1]) => updateCustomItem(sectionId, item),
    onRemove: (id: string) => removeCustomItem(sectionId, id),
    onReorder: (items: Parameters<typeof reorderCustomItems>[1]) => reorderCustomItems(sectionId, items),
  }
}
