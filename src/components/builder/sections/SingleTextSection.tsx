"use client"

import * as React from "react"
import { Loader2, Sparkles } from "lucide-react"
import { RichTextEditor } from "@/components/builder/richtext/RichTextEditor"
import { Button } from "@/components/ui/button"
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback"

export function SingleTextSection({
  value,
  onChange,
  placeholder,
  aiLabel,
  onAiAssist,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  aiLabel: string
  onAiAssist: () => Promise<string>
}) {
  const [loading, setLoading] = React.useState(false)
  const debouncedOnChange = useDebouncedCallback(onChange, 250)

  async function handleAi() {
    setLoading(true)
    try {
      onChange(await onAiAssist())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" className="h-6 px-1.5 text-xs text-primary" disabled={loading} onClick={handleAi}>
          {loading ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : <Sparkles className="size-3" aria-hidden="true" />}
          {aiLabel}
        </Button>
      </div>
      <RichTextEditor value={value} onChange={debouncedOnChange} placeholder={placeholder} />
    </div>
  )
}
