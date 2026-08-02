import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function ModernGreenDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ borderBottomWidth: 2, borderBottomColor: tokens.primary, paddingBottom: 8 }}>
          <Text style={{ fontSize: tokens.size.xxl, fontWeight: 700, color: tokens.primary }}>{personal.fullName || "Your Name"}</Text>
          {personal.role && <Text style={{ fontSize: tokens.size.lg, color: tokens.muted }}>{personal.role}</Text>}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", borderBottomWidth: 1, borderBottomColor: tokens.border, paddingVertical: 6, marginBottom: 10 }}>
          <PdfContactField icon="mail" value={personal.email} tokens={tokens} />
          <PdfContactField icon="phone" value={personal.phone} tokens={tokens} />
          <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} />
          <PdfContactField icon="globe" value={personal.website} tokens={tokens} />
          <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} />
          <PdfContactField icon="github" value={personal.github} tokens={tokens} />
        </View>

        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => (
            <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={tokens} />
          ))}
      </Page>
    </Document>
  )
}
