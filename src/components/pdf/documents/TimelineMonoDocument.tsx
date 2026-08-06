import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function TimelineMonoDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data
  const sections = sectionOrder.filter((s) => s.ref !== "personal")

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ borderBottomWidth: 2, borderBottomColor: tokens.primary, paddingBottom: 8, marginBottom: 12 }}>
          <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
          {personal.role && <Text style={styles.role}>{personal.role}</Text>}
          <View style={[styles.wrapRow, { marginTop: 6 }]}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} />
            <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} />
            <PdfContactField icon="globe" value={personal.portfolio} tokens={tokens} />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} />
          </View>
        </View>

        {sections.map((meta) => (
          <View key={meta.ref} style={{ borderLeftWidth: 2, borderLeftColor: tokens.border, paddingLeft: 10, marginLeft: 4 }}>
            <PdfSectionContent meta={meta} data={data} tokens={tokens} />
          </View>
        ))}
      </Page>
    </Document>
  )
}
