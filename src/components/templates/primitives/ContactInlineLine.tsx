import { Fragment } from "react"
import { contactLinkLabel, normalizeContactHref, type ContactLinkKind } from "@/lib/contact/normalizeHref"

/**
 * On-screen mirror of <PdfContactInlineLine> for templates that render their header contact
 * line as one joined string rather than via <ContactItem> rows.
 */
export function ContactInlineLine({
  items,
  separator,
  className,
}: {
  items: { value: string; kind?: ContactLinkKind }[]
  separator: string
  className?: string
}) {
  const filtered = items.filter((item) => item.value)
  if (filtered.length === 0) return null

  return (
    <p className={className}>
      {filtered.map((item, i) => {
        const href = item.kind ? normalizeContactHref(item.kind, item.value) : undefined
        return (
          <Fragment key={i}>
            {i > 0 && separator}
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {contactLinkLabel(item.kind as ContactLinkKind, item.value)}
              </a>
            ) : (
              item.value
            )}
          </Fragment>
        )
      })}
    </p>
  )
}
