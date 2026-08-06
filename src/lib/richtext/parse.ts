import type { RichTextAlign, RichTextMark, RichTextNode, RichTextParagraph, RichTextRun } from "@/lib/richtext/types"

/**
 * Whitelist-only HTML->AST parser for the small tag vocabulary Tiptap's editor produces
 * (p, ul/li, strong/b, em/i, u, span[style color|font-size], br). No DOMParser/jsdom is used,
 * so this runs identically in the browser and in Node, and unrecognized tags/attributes are
 * simply inert data rather than something that could execute - this doubles as sanitization.
 */

type RawNode =
  | { kind: "text"; text: string }
  | { kind: "element"; tag: string; attrs: Record<string, string>; children: RawNode[] }

const VOID_TAGS = new Set(["br", "img", "hr"])
const DROP_TAGS = new Set(["script", "style", "iframe", "object", "embed"])
const MARK_TAGS: Record<string, keyof RichTextMark> = { strong: "bold", b: "bold", em: "italic", i: "italic", u: "underline" }

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
}

function parseAttrs(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const re = /([a-zA-Z-]+)\s*=\s*"([^"]*)"/g
  let match: RegExpExecArray | null
  while ((match = re.exec(attrString))) {
    attrs[match[1].toLowerCase()] = match[2]
  }
  return attrs
}

function parseStyle(styleString: string | undefined): { color?: string; fontSize?: string; textAlign?: RichTextAlign } {
  const result: { color?: string; fontSize?: string; textAlign?: RichTextAlign } = {}
  if (!styleString) return result
  for (const declaration of styleString.split(";")) {
    const [rawProp, ...rawVal] = declaration.split(":")
    if (!rawProp || rawVal.length === 0) continue
    const prop = rawProp.trim().toLowerCase()
    const value = rawVal.join(":").trim()
    if (prop === "color" && /^#[0-9a-fA-F]{3,8}$|^rgb/.test(value)) result.color = value
    else if (prop === "font-size" && value) result.fontSize = value
    else if (prop === "text-align" && (value === "left" || value === "center" || value === "right")) result.textAlign = value
  }
  return result
}

function tokenizeToTree(html: string): RawNode[] {
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g
  const root: RawNode = { kind: "element", tag: "#root", attrs: {}, children: [] }
  const stack: (RawNode & { kind: "element" })[] = [root as RawNode & { kind: "element" }]
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = tagRe.exec(html))) {
    const [full, tagNameRaw, attrString] = match
    const tagName = tagNameRaw.toLowerCase()
    const isClosing = full.startsWith("</")
    const isSelfClosing = full.endsWith("/>") || VOID_TAGS.has(tagName)

    if (match.index > lastIndex) {
      const text = decodeEntities(html.slice(lastIndex, match.index))
      if (text) stack[stack.length - 1].children.push({ kind: "text", text })
    }
    lastIndex = tagRe.lastIndex

    if (isClosing) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tagName) {
          stack.length = i
          break
        }
      }
    } else {
      const node: RawNode & { kind: "element" } = { kind: "element", tag: tagName, attrs: parseAttrs(attrString), children: [] }
      stack[stack.length - 1].children.push(node)
      if (!isSelfClosing) stack.push(node)
    }
  }
  if (lastIndex < html.length) {
    const text = decodeEntities(html.slice(lastIndex))
    if (text) stack[stack.length - 1].children.push({ kind: "text", text })
  }
  return root.kind === "element" ? root.children : []
}

function collectRuns(nodes: RawNode[], inherited: RichTextMark): RichTextRun[] {
  const runs: RichTextRun[] = []
  for (const node of nodes) {
    if (node.kind === "text") {
      if (node.text) runs.push({ text: node.text, marks: inherited })
      continue
    }
    if (DROP_TAGS.has(node.tag)) continue
    if (node.tag === "br") {
      runs.push({ text: "\n", marks: inherited })
      continue
    }
    const markKey = MARK_TAGS[node.tag]
    if (markKey) {
      runs.push(...collectRuns(node.children, { ...inherited, [markKey]: true }))
      continue
    }
    if (node.tag === "span") {
      const style = parseStyle(node.attrs.style)
      const marks: RichTextMark = { ...inherited }
      if (style.color) marks.color = style.color
      if (style.fontSize) marks.fontSize = style.fontSize
      runs.push(...collectRuns(node.children, marks))
      continue
    }
    // Unrecognized inline tag: unwrap and keep its text content with inherited marks only.
    runs.push(...collectRuns(node.children, inherited))
  }
  return runs
}

function paragraphFromElement(node: RawNode & { kind: "element" }): RichTextParagraph | null {
  const style = parseStyle(node.attrs.style)
  const runs = collectRuns(node.children, {})
  if (runs.length === 0) return null
  return { type: "paragraph", align: style.textAlign, runs }
}

export function parseRichTextHtml(html: string): RichTextNode[] {
  if (!html) return []
  const tree = tokenizeToTree(html)
  const nodes: RichTextNode[] = []

  for (const node of tree) {
    if (node.kind === "text") {
      const text = node.text.trim()
      if (text) nodes.push({ type: "paragraph", runs: [{ text, marks: {} }] })
      continue
    }
    if (DROP_TAGS.has(node.tag)) continue

    if (node.tag === "p") {
      const paragraph = paragraphFromElement(node)
      if (paragraph) nodes.push(paragraph)
      continue
    }

    if (node.tag === "ul") {
      const items: RichTextParagraph[][] = []
      for (const li of node.children) {
        if (li.kind !== "element" || li.tag !== "li") continue
        const blockParagraphs = li.children.filter(
          (child): child is RawNode & { kind: "element" } => child.kind === "element" && child.tag === "p",
        )
        if (blockParagraphs.length > 0) {
          const paragraphs = blockParagraphs.map(paragraphFromElement).filter((p): p is RichTextParagraph => p !== null)
          if (paragraphs.length > 0) items.push(paragraphs)
        } else {
          const runs = collectRuns(li.children, {})
          if (runs.length > 0) items.push([{ type: "paragraph", runs }])
        }
      }
      if (items.length > 0) nodes.push({ type: "bulletList", items })
      continue
    }

    if (node.tag === "li") continue // orphaned <li> outside a <ul>, ignore

    // Unrecognized block-level wrapper (e.g. a stray <div>): flatten its text content into one paragraph.
    const runs = collectRuns([node], {})
    if (runs.length > 0) nodes.push({ type: "paragraph", runs })
  }

  return nodes
}
