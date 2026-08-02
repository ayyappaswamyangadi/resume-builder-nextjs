"use client"

import { useResumeStore, type RepeatableKey } from "@/store/resumeStore"
import type { ResumeData } from "@/types/resume"

/** Binds the resume store's generic array CRUD actions to one ResumeData key, for use with <RepeatableSection>. */
export function useRepeatableActions<K extends RepeatableKey>(key: K) {
  const addItem = useResumeStore((s) => s.addItem)
  const updateItem = useResumeStore((s) => s.updateItem)
  const removeItem = useResumeStore((s) => s.removeItem)
  const reorderItems = useResumeStore((s) => s.reorderItems)

  type Item = ResumeData[K][number]

  return {
    onAdd: (item: Item) => addItem(key, item),
    onUpdate: (item: Item & { id: string }) => updateItem(key, item.id, item),
    onRemove: (id: string) => removeItem(key, id),
    onReorder: (items: ResumeData[K]) => reorderItems(key, items),
  }
}
