import { parseRichTextHtml } from "@/lib/richtext/parse"
import type { RichTextParagraph } from "@/lib/richtext/types"

function paragraphText(paragraph: RichTextParagraph): string {
  return paragraph.runs.map((run) => run.text).join("")
}

/** Strips a rich-text HTML string down to plain text (paragraphs/list items joined by newlines). */
export function toPlainText(html: string): string {
  const nodes = parseRichTextHtml(html)
  const lines: string[] = []
  for (const node of nodes) {
    if (node.type === "paragraph") {
      lines.push(paragraphText(node))
    } else {
      for (const item of node.items) {
        lines.push(item.map(paragraphText).join(" "))
      }
    }
  }
  return lines.join("\n").trim()
}

/** True if the rich-text HTML string has no visible text (used in place of `!value` checks). */
export function isRichTextEmpty(html: string): boolean {
  return toPlainText(html).length === 0
}
