import { Fragment, type CSSProperties } from "react"
import { parseRichTextHtml } from "@/lib/richtext/parse"
import type { RichTextParagraph, RichTextRun } from "@/lib/richtext/types"

function Run({ run }: { run: RichTextRun }) {
  const style: CSSProperties = {}
  if (run.marks.bold) style.fontWeight = 700
  if (run.marks.italic) style.fontStyle = "italic"
  if (run.marks.underline) style.textDecoration = "underline"
  if (run.marks.color) style.color = run.marks.color
  if (run.marks.fontSize) style.fontSize = run.marks.fontSize

  const lines = run.text.split("\n")
  return (
    <span style={style}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </span>
  )
}

function Paragraph({ paragraph }: { paragraph: RichTextParagraph }) {
  return (
    <p style={paragraph.align ? { textAlign: paragraph.align } : undefined}>
      {paragraph.runs.map((run, i) => (
        <Run key={i} run={run} />
      ))}
    </p>
  )
}

/** On-screen counterpart to <renderRichTextToPdf>: walks the same rich-text AST into plain React elements (no dangerouslySetInnerHTML). */
export function RichTextView({ html, className }: { html: string; className?: string }) {
  const nodes = parseRichTextHtml(html)
  if (nodes.length === 0) return null

  return (
    <div className={className}>
      {nodes.map((node, i) =>
        node.type === "paragraph" ? (
          <Paragraph key={i} paragraph={node} />
        ) : (
          <ul key={i} className="list-disc space-y-0.5 pl-4 marker:text-[var(--tpl-muted)]">
            {node.items.map((paragraphs, j) => (
              <li key={j}>
                {paragraphs.map((paragraph, k) => (
                  <Paragraph key={k} paragraph={paragraph} />
                ))}
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}
