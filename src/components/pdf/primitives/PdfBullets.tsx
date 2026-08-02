import { Text, View } from "@react-pdf/renderer"
import type { ResolvedTokens } from "@/lib/templates/tokens"

export function PdfBullets({ items, tokens }: { items: string[]; tokens: ResolvedTokens }) {
  const filtered = items.filter((line) => line.trim().length > 0)
  if (filtered.length === 0) return null
  return (
    <>
      {filtered.map((line, i) => (
        <View key={i} style={{ flexDirection: "row", marginTop: 2 }} wrap={false}>
          <Text style={{ width: 10, fontSize: tokens.size.sm, color: tokens.muted }}>{"•"}</Text>
          <Text style={{ flex: 1, fontSize: tokens.size.sm }}>{line}</Text>
        </View>
      ))}
    </>
  )
}
