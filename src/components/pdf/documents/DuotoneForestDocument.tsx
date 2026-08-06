import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { PdfProfilePhoto } from "@/components/pdf/primitives/PdfProfilePhoto"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

/**
 * react-pdf has no reliable z-index/absolute-overlay support, so the "photo on the
 * seam" web effect is approximated here as a two-tone row (left = primary, right =
 * accent) with the photo, name, role, and contact row centered inside the left block.
 */
export function DuotoneForestDocument({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, backgroundColor: tokens.primary, alignItems: "center", justifyContent: "center", paddingVertical: 20 }}>
            {showPhoto && (
              <PdfProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} size={88} backgroundColor={tokens.accent} />
            )}
            <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700, color: "#ffffff", marginTop: 8, textAlign: "center" }}>
              {personal.fullName || "Your Name"}
            </Text>
            {personal.role && (
              <Text style={{ fontSize: tokens.size.lg, color: "rgba(255,255,255,0.9)", marginTop: 2, textAlign: "center" }}>
                {personal.role}
              </Text>
            )}
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
              <PdfContactField icon="mail" value={personal.email} tokens={tokens} color="rgba(255,255,255,0.9)" />
              <PdfContactField icon="phone" value={personal.phone} tokens={tokens} color="rgba(255,255,255,0.9)" />
              <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} color="rgba(255,255,255,0.9)" />
            </View>
          </View>
          <View style={{ flex: 1, backgroundColor: tokens.accent }} />
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
