import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent, pdfSectionHasContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactInlineLine } from "@/components/pdf/primitives/PdfContactInlineLine"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function MaterialStyleDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data
  const sections = sectionOrder.filter((s) => s.ref !== "personal" && pdfSectionHasContent(s, data))

  return (
    <Document>
      <Page size="A4" style={[styles.page, { backgroundColor: "#f3f4f6" }]}>
        <View style={{ backgroundColor: tokens.primary, borderRadius: tokens.radius, padding: 14, marginBottom: 10 }}>
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 500, color: "#ffffff" }}>{personal.fullName || "Your Name"}</Text>
          {personal.role && <Text style={{ fontSize: tokens.size.lg, color: "rgba(255,255,255,0.9)" }}>{personal.role}</Text>}
          <PdfContactInlineLine
            items={[
            { value: personal.email, kind: "email" },
            { value: personal.phone },
            { value: personal.address },
            { value: personal.portfolio, kind: "portfolio" },
            { value: personal.linkedin, kind: "linkedin" },
          ]}
            separator="  •  "
            style={{ fontSize: tokens.size.xs, color: "rgba(255,255,255,0.85)", marginTop: 4 }}
          />
        </View>

        {sections.map((meta) => (
          <View
            key={meta.ref}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: tokens.radius,
              borderTopWidth: 3,
              borderTopColor: tokens.accent,
              padding: 10,
              marginBottom: 8,
            }}
            wrap={false}
          >
            <PdfSectionContent meta={meta} data={data} tokens={tokens} />
          </View>
        ))}
      </Page>
    </Document>
  )
}
