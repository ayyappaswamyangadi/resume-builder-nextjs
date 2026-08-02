"use client"

import { motion } from "motion/react"
import { Check, ImageOff, Loader2, Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScaledPagePreview } from "@/components/builder/ScaledPagePreview"
import { SAMPLE_RESUME_DATA, SAMPLE_SECTION_ORDER } from "@/constants/sample-resume"
import type { TemplateDefinition } from "@/types/template"

const BADGE_META = {
  ats: { label: "ATS Friendly", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  popular: { label: "Popular", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  premium: { label: "Premium", className: "bg-violet-500/15 text-violet-600 dark:text-violet-400" },
}

export function TemplateCard({
  template,
  onSelect,
  isCreating,
}: {
  template: TemplateDefinition
  onSelect: () => void
  isCreating: boolean
}) {
  const Preview = template.PreviewComponent

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <div className="relative h-64 overflow-hidden bg-muted/40 p-3">
        <div className="pointer-events-none origin-top scale-[0.62]">
          <ScaledPagePreview>
            <Preview
              data={SAMPLE_RESUME_DATA}
              sectionOrder={SAMPLE_SECTION_ORDER}
              customization={template.defaultCustomization}
              showPhoto={template.hasPhoto}
            />
          </ScaledPagePreview>
        </div>
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {template.badges.map((badge) => (
            <Badge key={badge} className={BADGE_META[badge].className} variant="secondary">
              {badge === "premium" && <Sparkles className="size-3" aria-hidden="true" />}
              {BADGE_META[badge].label}
            </Badge>
          ))}
        </div>
        <div className="absolute right-2 top-2">
          <Badge variant="outline" className="gap-1 bg-background/80">
            {template.hasPhoto ? <User className="size-3" aria-hidden="true" /> : <ImageOff className="size-3" aria-hidden="true" />}
            {template.hasPhoto ? "Photo" : "No photo"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-semibold">{template.name}</h3>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {template.categories.map((c) => (
            <Badge key={c} variant="outline" className="text-xs font-normal">
              {c}
            </Badge>
          ))}
        </div>
        <Button className="mt-auto w-full" onClick={onSelect} disabled={isCreating}>
          {isCreating ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="size-4" aria-hidden="true" />
          )}
          Use this template
        </Button>
      </div>
    </motion.div>
  )
}
