"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import { Plus, Trash2 } from "lucide-react"
import { RichTextEditorRow } from "@/components/builder/forms/RichTextEditorRow"
import { RichTextToolbar } from "@/components/builder/richtext/RichTextToolbar"
import { Button } from "@/components/ui/button"

/**
 * Editor for array-of-bullets fields (e.g. experience highlights): one rich-text row per
 * bullet with add/remove controls, sharing a single toolbar that acts on whichever row
 * currently has focus - avoids a full toolbar per row while still letting each bullet carry
 * its own bold/italic/color/size formatting.
 */
export function RichBulletListField({
  value,
  onChange,
  placeholder,
}: {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}) {
  const [activeEditor, setActiveEditor] = React.useState<Editor | null>(null)
  const [focusRowIndex, setFocusRowIndex] = React.useState<number | null>(null)
  const rows = value.length > 0 ? value : [""]

  function updateRow(index: number, html: string) {
    const next = [...rows]
    next[index] = html
    onChange(next)
  }

  function addRow() {
    const next = [...rows, ""]
    onChange(next)
    setFocusRowIndex(next.length - 1)
  }

  function removeRow(index: number) {
    const next = rows.filter((_, i) => i !== index)
    onChange(next.length > 0 ? next : [""])
  }

  return (
    <div className="space-y-1.5">
      <div className="rounded-lg border border-input">
        {activeEditor ? (
          <RichTextToolbar editor={activeEditor} />
        ) : (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">Click a bullet below to format it</div>
        )}
      </div>
      <div className="space-y-1.5">
        {rows.map((row, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <RichTextEditorRow
              value={row}
              onChange={(html) => updateRow(i, html)}
              onFocusEditor={setActiveEditor}
              placeholder={placeholder}
              autoFocus={focusRowIndex === i}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Remove bullet"
              onClick={() => removeRow(i)}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="size-3.5" aria-hidden="true" />
        Add bullet
      </Button>
    </div>
  )
}
