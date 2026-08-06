import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { PdfProfilePhoto } from "@/components/pdf/primitives/PdfProfilePhoto"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function PortraitBoldDocument({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        <View
          style={{
            alignItems: "center",
            backgroundColor: tokens.primary,
            paddingTop: `${tokens.spacing.pageMargin}mm`,
            paddingBottom: `${tokens.spacing.pageMargin * 0.6}mm`,
            paddingHorizontal: `${tokens.spacing.pageMargin}mm`,
          }}
        >
          {showPhoto && (
            <PdfProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} size={92} backgroundColor={tokens.accent} />
          )}
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700, color: "#ffffff", marginTop: 8, textAlign: "center" }}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.role && (
            <Text style={{ fontSize: tokens.size.lg, color: tokens.accent, marginTop: 2, textAlign: "center" }}>
              {personal.role}
            </Text>
          )}
          <View style={{ width: 40, height: 2, backgroundColor: "rgba(255,255,255,0.7)", marginVertical: 6 }} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="globe" value={personal.portfolio} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} color="rgba(255,255,255,0.85)" />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} color="rgba(255,255,255,0.85)" />
          </View>
        </View>

        <View style={{ padding: `${tokens.spacing.pageMargin}mm`, paddingTop: 14 }}>
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
