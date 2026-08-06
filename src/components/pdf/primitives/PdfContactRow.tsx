import { Link, Text, View } from "@react-pdf/renderer"
import { PdfIcon } from "@/components/pdf/primitives/PdfIcon"
import { contactLinkLabel, normalizeContactHref, type ContactLinkKind } from "@/lib/contact/normalizeHref"
import type { ICON_NODES } from "@/lib/pdf/icon-nodes"
import type { ResolvedTokens } from "@/lib/templates/tokens"

// Every template passes one of these icon keys per semantic contact field (verified across all
// documents that use this primitive), so link "kind" can be inferred here instead of requiring
// each of the ~33 call sites to also pass it explicitly.
const LINK_KIND: Partial<Record<keyof typeof ICON_NODES, ContactLinkKind>> = {
  mail: "email",
  globe: "portfolio",
  linkedin: "linkedin",
  github: "github",
}

export function PdfContactField({
  icon,
  value,
  tokens,
  color,
}: {
  icon: keyof typeof ICON_NODES
  value: string
  tokens: ResolvedTokens
  color?: string
}) {
  if (!value) return null
  const iconColor = color ?? tokens.muted
  const textStyle = { fontSize: tokens.size.xs, color: color ?? tokens.muted }
  const kind = LINK_KIND[icon]
  const href = kind ? normalizeContactHref(kind, value) : undefined

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginRight: 10, marginBottom: 2 }}>
      {tokens.iconStyle !== "none" && <PdfIcon name={icon} color={iconColor} size={tokens.size.xs} />}
      {href ? (
        <Link src={href} style={[textStyle, { textDecoration: "none" }]}>
          {kind ? contactLinkLabel(kind, value) : value}
        </Link>
      ) : (
        <Text style={textStyle}>{value}</Text>
      )}
    </View>
  )
}
