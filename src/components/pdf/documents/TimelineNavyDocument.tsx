import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function TimelineNavyDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data
  const sections = sectionOrder.filter((s) => s.ref !== "personal")
  const margin = `${tokens.spacing.pageMargin}mm`

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        <View style={{ backgroundColor: tokens.primary, padding: margin }}>
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700, color: "#ffffff" }}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.role && (
            <Text style={{ fontSize: tokens.size.lg, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
              {personal.role}
            </Text>
          )}
          <View style={[styles.wrapRow, { marginTop: 6 }]}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="globe" value={personal.portfolio} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} color="rgba(255,255,255,0.85)" />
          </View>
        </View>

        <View style={{ padding: margin }}>
          {sections.map((meta) => (
            <View key={meta.ref} style={{ borderLeftWidth: 2, borderLeftColor: tokens.border, paddingLeft: 10, marginLeft: 4 }}>
              <PdfSectionContent meta={meta} data={data} tokens={tokens} />
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
