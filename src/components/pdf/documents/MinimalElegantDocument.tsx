import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactInlineLine } from "@/components/pdf/primitives/PdfContactInlineLine"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function MinimalElegantDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: `${tokens.spacing.pageMargin * 1.2}mm ${tokens.spacing.pageMargin}mm` }]}>
        <View style={{ alignItems: "center", marginBottom: 14 }}>
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 400, letterSpacing: 1, color: tokens.primary }}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.role && (
            <Text style={{ fontSize: tokens.size.base, textTransform: "uppercase", letterSpacing: 3, color: tokens.muted, marginTop: 3 }}>
              {personal.role}
            </Text>
          )}
          <View style={{ width: 40, height: 1, backgroundColor: tokens.accent, marginVertical: 8 }} />
          <PdfContactInlineLine
            items={[
            { value: personal.email, kind: "email" },
            { value: personal.phone },
            { value: personal.address },
            { value: personal.portfolio, kind: "portfolio" },
            { value: personal.linkedin, kind: "linkedin" },
          ]}
            separator="   ·   "
            style={styles.xsmall}
          />
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
