import { Fragment } from "react"
import { Link, Text } from "@react-pdf/renderer"
import type { Style } from "@react-pdf/types"
import { contactLinkLabel, normalizeContactHref, type ContactLinkKind } from "@/lib/contact/normalizeHref"

/**
 * For PDF documents that render their header contact line as one joined `<Text>` string
 * (rather than via <PdfContactField> rows) - preserves each document's exact separator/layout
 * while making email/url values clickable.
 */
export function PdfContactInlineLine({
  items,
  separator,
  style,
}: {
  items: { value: string; kind?: ContactLinkKind }[]
  separator: string
  style: Style | Style[]
}) {
  const filtered = items.filter((item) => item.value)
  if (filtered.length === 0) return null

  const noUnderline: Style = { textDecoration: "none" }
  const linkStyle = Array.isArray(style) ? [...style, noUnderline] : [style, noUnderline]

  return (
    <Text style={style}>
      {filtered.map((item, i) => {
        const href = item.kind ? normalizeContactHref(item.kind, item.value) : undefined
        return (
          <Fragment key={i}>
            {i > 0 && separator}
            {href ? (
              <Link src={href} style={linkStyle}>
                {contactLinkLabel(item.kind as ContactLinkKind, item.value)}
              </Link>
            ) : (
              item.value
            )}
          </Fragment>
        )
      })}
    </Text>
  )
}
