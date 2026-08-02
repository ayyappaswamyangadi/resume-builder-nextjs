import { Text } from "@react-pdf/renderer"
import { getSectionHeadingStyle } from "@/lib/pdf/styles"
import type { ResolvedTokens } from "@/lib/templates/tokens"

export function PdfSectionHeading({ tokens, children }: { tokens: ResolvedTokens; children: string }) {
  return <Text style={[getSectionHeadingStyle(tokens), { marginBottom: 4 }]}>{children}</Text>
}
