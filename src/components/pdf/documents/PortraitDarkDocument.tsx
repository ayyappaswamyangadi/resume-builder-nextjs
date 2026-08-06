import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { PdfProfilePhoto } from "@/components/pdf/primitives/PdfProfilePhoto"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

const DARK_HEADER = "#111827"

export function PortraitDarkDocument({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        <View
          style={{
            alignItems: "center",
            backgroundColor: DARK_HEADER,
            paddingTop: `${tokens.spacing.pageMargin}mm`,
            paddingBottom: `${tokens.spacing.pageMargin * 0.6}mm`,
            paddingHorizontal: `${tokens.spacing.pageMargin}mm`,
          }}
        >
          {/* react-pdf has no box-shadow/ring; the accent-colored photo ring from the web
              preview isn't replicable here, so the accent color is applied via the
              initials-placeholder background instead. */}
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
          <View style={{ width: 40, height: 2, backgroundColor: tokens.accent, marginVertical: 6 }} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} color="#d1d5db" />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} color="#d1d5db" />
            <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} color="#d1d5db" />
            <PdfContactField icon="globe" value={personal.portfolio} tokens={tokens} color="#d1d5db" />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} color="#d1d5db" />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} color="#d1d5db" />
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
