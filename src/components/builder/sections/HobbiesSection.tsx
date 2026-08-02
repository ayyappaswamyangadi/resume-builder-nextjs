"use client"

import { Textarea } from "@/components/ui/textarea"

export function HobbiesSection({ hobbies, onChange }: { hobbies: string[]; onChange: (value: string[]) => void }) {
  return (
    <div className="space-y-1.5">
      <Textarea
        rows={3}
        placeholder="Reading, Photography, Chess…"
        value={hobbies.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
      />
      <p className="text-xs text-muted-foreground">One per line.</p>
    </div>
  )
}
