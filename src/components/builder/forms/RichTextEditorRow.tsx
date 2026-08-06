"use client"

import * as React from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextStyle, Color, FontSize } from "@tiptap/extension-text-style"
import Placeholder from "@tiptap/extension-placeholder"
import { cn } from "@/lib/utils"

/** One bullet's editor within a <RichBulletListField> - a paragraph-only Tiptap instance (the array itself supplies the list structure). */
export function RichTextEditorRow({
  value,
  onChange,
  onFocusEditor,
  placeholder,
  autoFocus,
}: {
  value: string
  onChange: (html: string) => void
  onFocusEditor: (editor: Editor) => void
  placeholder?: string
  autoFocus?: boolean
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
        bulletList: false,
        listItem: false,
        orderedList: false,
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    onFocus: ({ editor }) => onFocusEditor(editor),
  })

  React.useEffect(() => {
    if (!editor || editor.isFocused) return
    const current = editor.isEmpty ? "" : editor.getHTML()
    if (value !== current) editor.commands.setContent(value, { emitUpdate: false })
  }, [value, editor])

  React.useEffect(() => {
    if (autoFocus && editor) editor.commands.focus("end")
    // Only run on mount - this is a one-time "focus the newly added row" trigger, not a reactive sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  if (!editor) return null

  return (
    <EditorContent
      editor={editor}
      className={cn(
        "min-h-8 flex-1 rounded-md border border-input px-2 py-1.5 text-sm [&_.ProseMirror]:outline-none",
        // Tiptap's Placeholder extension puts `is-editor-empty` on the empty child node (e.g. <p>),
        // not on the .ProseMirror container itself - the selector must be a descendant, not compound.
        "[&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
      )}
    />
  )
}
