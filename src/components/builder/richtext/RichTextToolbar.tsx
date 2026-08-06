"use client"

import type { Editor } from "@tiptap/react"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Base UI's Select reserves "" for "nothing selected", so font sizes are keyed by name and
// mapped to/from the actual CSS value that Tiptap's textStyle mark stores.
const FONT_SIZES = [
  { key: "small", label: "Small", css: "11px" },
  { key: "normal", label: "Normal", css: "" },
  { key: "large", label: "Large", css: "15px" },
  { key: "xlarge", label: "X-Large", css: "18px" },
]
const CSS_BY_SIZE_KEY = Object.fromEntries(FONT_SIZES.map((s) => [s.key, s.css]))
const SIZE_KEY_BY_CSS = Object.fromEntries(FONT_SIZES.map((s) => [s.css, s.key]))

const COLORS = ["#1f2937", "#dc2626", "#d97706", "#16a34a", "#2563eb", "#7c3aed", "#db2777", "#6b7280"]

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={active}
      className={cn(active && "bg-muted text-foreground")}
      // Toolbar buttons must not steal DOM focus from the editor on click - otherwise the
      // browser moves keyboard focus to the button and subsequent typing goes nowhere.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

/** Fixed formatting toolbar for a single Tiptap editor instance: bold/italic/underline, size, align, color, bullets. */
export function RichTextToolbar({ editor, bulletList = false }: { editor: Editor; bulletList?: boolean }) {
  const currentFontSize = (editor.getAttributes("textStyle").fontSize as string | undefined) ?? ""
  const currentFontSizeKey = SIZE_KEY_BY_CSS[currentFontSize] ?? "normal"
  const currentColor = (editor.getAttributes("textStyle").color as string | undefined) ?? ""

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input px-1.5 py-1">
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline />
      </ToolbarButton>

      <Select
        value={currentFontSizeKey}
        onValueChange={(key) => {
          const css = CSS_BY_SIZE_KEY[key as string] ?? ""
          if (css) editor.chain().focus().setFontSize(css).run()
          else editor.chain().focus().unsetFontSize().run()
        }}
      >
        <SelectTrigger size="sm" className="h-7 text-xs">
          <SelectValue placeholder="Normal" />
        </SelectTrigger>
        <SelectContent>
          {FONT_SIZES.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ToolbarButton
        label="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft />
      </ToolbarButton>
      <ToolbarButton
        label="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter />
      </ToolbarButton>
      <ToolbarButton
        label="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight />
      </ToolbarButton>

      <Popover>
        <PopoverTrigger
          render={
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Text color">
              <Palette style={currentColor ? { color: currentColor } : undefined} />
            </Button>
          }
        />
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-4 gap-1.5">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={color}
                className={cn(
                  "size-6 rounded-full ring-1 ring-foreground/10",
                  currentColor === color && "ring-2 ring-foreground",
                )}
                style={{ backgroundColor: color }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().setColor(color).run()}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {bulletList && (
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolbarButton>
      )}
    </div>
  )
}
