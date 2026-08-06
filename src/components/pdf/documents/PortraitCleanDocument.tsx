import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { PdfProfilePhoto } from "@/components/pdf/primitives/PdfProfilePhoto"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function PortraitCleanDocument({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ alignItems: "center" }}>
          {showPhoto && (
            <PdfProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} size={92} backgroundColor={tokens.primary} />
          )}
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700, color: tokens.primary, marginTop: 8, textAlign: "center" }}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.role && (
            <Text style={{ fontSize: tokens.size.lg, color: tokens.accent, marginTop: 2, textAlign: "center" }}>
              {personal.role}
            </Text>
          )}
          <View style={{ width: 40, height: 2, backgroundColor: tokens.accent, marginVertical: 6 }} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} />
            <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} />
            <PdfContactField icon="globe" value={personal.portfolio} tokens={tokens} />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} />
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
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
