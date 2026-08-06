import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent, pdfSectionHasContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactInlineLine } from "@/components/pdf/primitives/PdfContactInlineLine"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function LineworkBlackDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 400 }}>{personal.fullName || "Your Name"}</Text>
          {personal.role && (
            <Text style={{ fontSize: tokens.size.xs, textTransform: "uppercase", letterSpacing: 2, color: tokens.muted, marginTop: 3 }}>
              {personal.role}
            </Text>
          )}
          <View style={{ height: 0.5, backgroundColor: tokens.accent, marginTop: 8 }} />
          <PdfContactInlineLine
            items={[
            { value: personal.email, kind: "email" },
            { value: personal.phone },
            { value: personal.address },
            { value: personal.portfolio, kind: "portfolio" },
            { value: personal.linkedin, kind: "linkedin" },
            { value: personal.github, kind: "github" },
          ]}
            separator="   ·   "
            style={[styles.xsmall, { marginTop: 8 }]}
          />
        </View>

        <View style={{ marginTop: 14 }}>
          {sectionOrder
            .filter((s) => s.ref !== "personal" && pdfSectionHasContent(s, data))
            .map((meta) => (
              <View key={meta.ref} style={{ borderBottomWidth: 0.5, borderBottomColor: tokens.border, paddingBottom: 6 }}>
                <PdfSectionContent meta={meta} data={data} tokens={tokens} />
              </View>
            ))}
        </View>
      </Page>
    </Document>
  )
}
