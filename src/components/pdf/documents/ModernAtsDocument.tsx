import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function ModernAtsDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ borderBottomWidth: 2, borderBottomColor: tokens.text, paddingBottom: 8, marginBottom: 10, alignItems: "center" }}>
          <Text style={{ fontSize: tokens.size.xxl, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.role && <Text style={{ fontSize: tokens.size.lg, marginTop: 2 }}>{personal.role}</Text>}
          <Text style={[styles.xsmall, { marginTop: 4 }]}>
            {[personal.email, personal.phone, personal.address, personal.linkedin, personal.website].filter(Boolean).join("   |   ")}
          </Text>
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
