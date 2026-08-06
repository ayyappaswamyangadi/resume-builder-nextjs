"use client"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextStyle, Color, FontSize } from "@tiptap/extension-text-style"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { RichTextToolbar } from "@/components/builder/richtext/RichTextToolbar"
import { cn } from "@/lib/utils"

/**
 * Minimal rich-text editor (bold/italic/underline, font size, alignment, color, bullet list)
 * built on Tiptap. Stores/emits its content as HTML - see src/lib/richtext for the reader
 * that turns that HTML back into on-screen and PDF output.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  bulletList = false,
  minHeight = 80,
  className,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  bulletList?: boolean
  minHeight?: number
  className?: string
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        link: false,
        bulletList: bulletList ? {} : false,
        listItem: bulletList ? {} : false,
        orderedList: false,
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({ types: ["paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML())
    },
  })

  // Keep the editor in sync when `value` changes externally (e.g. AI-assist rewriting the field).
  // Only do this while the editor is unfocused: while the user is actively typing, `value` is
  // just an echo of our own onUpdate working its way back through the parent's state, and it can
  // lag behind the editor's true current content by a render or two - applying it mid-edit would
  // roll back keystrokes the user already made.
  React.useEffect(() => {
    if (!editor || editor.isFocused) return
    const current = editor.isEmpty ? "" : editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className={cn("overflow-hidden rounded-lg border border-input bg-transparent", className)}>
      <RichTextToolbar editor={editor} bulletList={bulletList} />
      <EditorContent
        editor={editor}
        style={{ "--rte-min-h": `${minHeight}px` } as React.CSSProperties}
        className={cn(
          "px-3 py-2 text-sm [&_.ProseMirror]:min-h-[var(--rte-min-h)] [&_.ProseMirror]:outline-none",
          // Tiptap's Placeholder extension puts `is-editor-empty` on the empty child node (e.g. <p>),
          // not on the .ProseMirror container itself - the selector must be a descendant, not compound.
          "[&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
        )}
      />
    </div>
  )
}
