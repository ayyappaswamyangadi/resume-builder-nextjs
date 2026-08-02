"use client"

import * as React from "react"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RepeatableSection } from "@/components/builder/RepeatableSection"
import { skillsConfig } from "@/constants/section-configs"
import { generateSkills } from "@/services/ai"
import { createId } from "@/lib/id"
import { useRepeatableActions } from "@/hooks/useRepeatableActions"
import type { SkillGroup } from "@/types/resume"

export function SkillsSection({ skills, role }: { skills: SkillGroup[]; role: string }) {
  const actions = useRepeatableActions("skills")
  const [loading, setLoading] = React.useState(false)

  async function handleGenerate() {
    setLoading(true)
    try {
      const items = await generateSkills(role)
      actions.onAdd({ id: createId(), category: "Core Skills", items })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" className="h-6 px-1.5 text-xs text-primary" disabled={loading} onClick={handleGenerate}>
          {loading ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : <Sparkles className="size-3" aria-hidden="true" />}
          Generate skills with AI
        </Button>
      </div>
      <RepeatableSection config={skillsConfig} items={skills} {...actions} />
    </div>
  )
}
