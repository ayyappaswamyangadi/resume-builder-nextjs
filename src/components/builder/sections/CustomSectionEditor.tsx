"use client"

import { RepeatableSection } from "@/components/builder/RepeatableSection"
import { customSectionItemConfig } from "@/constants/section-configs"
import { useCustomSectionActions } from "@/hooks/useCustomSectionActions"
import type { CustomSection } from "@/types/resume"

export function CustomSectionEditor({ section }: { section: CustomSection }) {
  const actions = useCustomSectionActions(section.id)
  return <RepeatableSection config={customSectionItemConfig} items={section.items} {...actions} />
}
