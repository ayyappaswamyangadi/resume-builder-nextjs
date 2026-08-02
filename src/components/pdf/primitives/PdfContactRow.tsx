import { Text, View } from "@react-pdf/renderer"
import { PdfIcon } from "@/components/pdf/primitives/PdfIcon"
import type { ICON_NODES } from "@/lib/pdf/icon-nodes"
import type { ResolvedTokens } from "@/lib/templates/tokens"

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
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginRight: 10, marginBottom: 2 }}>
      {tokens.iconStyle !== "none" && <PdfIcon name={icon} color={iconColor} size={tokens.size.xs} />}
      <Text style={{ fontSize: tokens.size.xs, color: color ?? tokens.muted }}>{value}</Text>
    </View>
  )
}
