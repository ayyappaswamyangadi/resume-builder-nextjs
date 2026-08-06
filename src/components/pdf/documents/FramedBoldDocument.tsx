import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent, pdfSectionHasContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactInlineLine } from "@/components/pdf/primitives/PdfContactInlineLine"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

/** Framed Bold PDF — double-ruled frame: colored outer border, thin neutral inner border. */
export function FramedBoldDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 8 }]}>
        <View style={{ flex: 1, borderWidth: 2, borderColor: tokens.primary, padding: 6 }}>
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: tokens.border,
              padding: `${tokens.spacing.pageMargin}mm`,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700 }}>{personal.fullName || "Your Name"}</Text>
              {personal.role && (
                <Text style={{ fontSize: tokens.size.base, fontStyle: "italic", color: tokens.muted }}>
                  {personal.role}
                </Text>
              )}
              <PdfContactInlineLine
                items={[
                { value: personal.address },
                { value: personal.phone },
                { value: personal.email, kind: "email" },
                { value: personal.linkedin, kind: "linkedin" },
              ]}
                separator=" | "
                style={[styles.xsmall, { marginTop: 3 }]}
              />
            </View>

            {sectionOrder
              .filter((s) => s.ref !== "personal" && pdfSectionHasContent(s, data))
              .map((meta) => (
                <View key={meta.ref} style={{ borderTopWidth: 1, borderTopColor: tokens.border, paddingTop: 6 }}>
                  <PdfSectionContent meta={meta} data={data} tokens={tokens} />
                </View>
              ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}
