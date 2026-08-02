import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { PdfProfilePhoto } from "@/components/pdf/primitives/PdfProfilePhoto"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function CorporateExecutiveDocument({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            borderBottomWidth: 3,
            borderBottomColor: tokens.primary,
            backgroundColor: tokens.surface,
            padding: `${tokens.spacing.pageMargin}mm`,
          }}
        >
          {showPhoto && <PdfProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} shape="square" size={72} backgroundColor={tokens.primary} />}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: tokens.size.xxl, fontWeight: 700, color: tokens.primary }}>{personal.fullName || "Your Name"}</Text>
            {personal.role && <Text style={{ fontSize: tokens.size.lg, fontWeight: 600, color: tokens.accent }}>{personal.role}</Text>}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}>
              <PdfContactField icon="mail" value={personal.email} tokens={tokens} />
              <PdfContactField icon="phone" value={personal.phone} tokens={tokens} />
              <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} />
              <PdfContactField icon="globe" value={personal.website} tokens={tokens} />
              <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} />
            </View>
          </View>
        </View>

        <View style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
          {sectionOrder
            .filter((s) => s.ref !== "personal")
            .map((meta) => (
              <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={tokens} />
            ))}
        </View>
      </Page>
    </Document>
  )
}
