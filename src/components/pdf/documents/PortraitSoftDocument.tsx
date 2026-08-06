import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { PdfProfilePhoto } from "@/components/pdf/primitives/PdfProfilePhoto"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

// react-pdf has no color-mix()/oklch support, so the header tint is a fixed light-lavender
// literal standing in for "a soft tint of the primary color" rather than a computed mix.
const SOFT_TINT = "#f3effc"

export function PortraitSoftDocument({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        <View
          style={{
            alignItems: "center",
            backgroundColor: SOFT_TINT,
            paddingTop: `${tokens.spacing.pageMargin}mm`,
            paddingBottom: `${tokens.spacing.pageMargin * 0.6}mm`,
            paddingHorizontal: `${tokens.spacing.pageMargin}mm`,
          }}
        >
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
