import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactInlineLine } from "@/components/pdf/primitives/PdfContactInlineLine"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function ScholarIvyDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 600 }}>{personal.fullName || "Your Name"}</Text>
          {personal.role && (
            <Text style={{ fontSize: tokens.size.base, fontStyle: "italic", color: tokens.muted, marginTop: 2 }}>
              {personal.role}
            </Text>
          )}
          <View style={{ width: 140, marginTop: 10 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: tokens.border }} />
            <View style={{ height: 3 }} />
            <View style={{ borderBottomWidth: 1, borderBottomColor: tokens.border }} />
          </View>
          <PdfContactInlineLine
            items={[
            { value: personal.email, kind: "email" },
            { value: personal.phone },
            { value: personal.address },
            { value: personal.linkedin, kind: "linkedin" },
            { value: personal.portfolio, kind: "portfolio" },
          ]}
            separator="   ·   "
            style={[styles.xsmall, { marginTop: 8 }]}
          />
        </View>

        <View style={{ marginTop: 14 }}>
          {sectionOrder
            .filter((s) => s.ref !== "personal")
            .map((meta) => (
              <View key={meta.ref} style={{ marginBottom: tokens.spacing.section * 0.15 }}>
                <PdfSectionContent meta={meta} data={data} tokens={tokens} />
              </View>
            ))}
        </View>
      </Page>
    </Document>
  )
}
