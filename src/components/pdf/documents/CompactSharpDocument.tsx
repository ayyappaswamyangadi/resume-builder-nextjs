import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactInlineLine } from "@/components/pdf/primitives/PdfContactInlineLine"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

/** Compact Sharp — contact info renders as one plain text line (no icons), matching the web preview. */
export function CompactSharpDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: tokens.border, paddingBottom: 4, marginBottom: 6 }}>
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.role && <Text style={{ fontSize: tokens.size.base, color: tokens.accent }}>{personal.role}</Text>}
          <PdfContactInlineLine
            items={[
            { value: personal.email, kind: "email" },
            { value: personal.phone },
            { value: personal.address },
            { value: personal.portfolio, kind: "portfolio" },
          ]}
            separator="   |   "
            style={[styles.xsmall, { marginTop: 3 }]}
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
