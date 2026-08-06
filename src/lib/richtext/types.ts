export type RichTextAlign = "left" | "center" | "right"

export type RichTextMark = {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: string
  fontSize?: string
}

export type RichTextRun = {
  text: string
  marks: RichTextMark
}

export type RichTextParagraph = {
  type: "paragraph"
  align?: RichTextAlign
  runs: RichTextRun[]
}

export type RichTextBulletList = {
  type: "bulletList"
  items: RichTextParagraph[][]
}

export type RichTextNode = RichTextParagraph | RichTextBulletList
