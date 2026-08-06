import type { ReactNode } from "react"
import { Text, View } from "@react-pdf/renderer"
import type { Style } from "@react-pdf/types"
import { parseRichTextHtml } from "@/lib/richtext/parse"
import type { RichTextParagraph, RichTextRun } from "@/lib/richtext/types"

type PdfTextStyle = Style

function runStyle(run: RichTextRun): PdfTextStyle {
  const style: PdfTextStyle = {}
  if (run.marks.bold) style.fontWeight = 700
  if (run.marks.italic) style.fontStyle = "italic"
  if (run.marks.underline) style.textDecoration = "underline"
  if (run.marks.color) style.color = run.marks.color
  if (run.marks.fontSize) {
    const parsed = parseFloat(run.marks.fontSize)
    if (!Number.isNaN(parsed)) style.fontSize = parsed
  }
  return style
}

function ParagraphText({ paragraph, baseStyle }: { paragraph: RichTextParagraph; baseStyle: PdfTextStyle }) {
  const style: PdfTextStyle[] = [baseStyle]
  if (paragraph.align) style.push({ textAlign: paragraph.align })
  return (
    <Text style={style}>
      {paragraph.runs.map((run, i) => (
        <Text key={i} style={runStyle(run)}>
          {run.text}
        </Text>
      ))}
    </Text>
  )
}

/**
 * Renders rich-text HTML (produced by the builder's Tiptap editor) as react-pdf nodes.
 * Paragraphs become styled <Text> runs; bullet lists reuse the same glyph-column layout as
 * <PdfBullets> so rich and plain bullets stay visually consistent.
 */
export function renderRichTextToPdf(html: string, baseStyle: PdfTextStyle, bulletColor?: string): ReactNode {
  const nodes = parseRichTextHtml(html)
  if (nodes.length === 0) return null

  return (
    <>
      {nodes.map((node, i) => {
        if (node.type === "paragraph") {
          return <ParagraphText key={i} paragraph={node} baseStyle={baseStyle} />
        }
        return (
          <View key={i} style={{ marginTop: 2 }}>
            {node.items.map((paragraphs, j) => (
              <View key={j} style={{ flexDirection: "row", marginTop: j === 0 ? 0 : 2 }} wrap={false}>
                <Text style={{ width: 10, fontSize: (baseStyle.fontSize as number | undefined) ?? 10, color: bulletColor }}>
                  {"•"}
                </Text>
                <View style={{ flex: 1 }}>
                  {paragraphs.map((paragraph, k) => (
                    <ParagraphText key={k} paragraph={paragraph} baseStyle={baseStyle} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )
      })}
    </>
  )
}
