import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent, pdfSectionHasContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { PdfProfilePhoto } from "@/components/pdf/primitives/PdfProfilePhoto"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

const SIDEBAR_REFS = new Set(["skills", "languages", "certifications", "hobbies", "references"])

export function PremiumPortfolioDocument({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const sidebarTokens = { ...tokens, primary: "#ffffff", text: "#e5e7eb", muted: "rgba(229,231,235,0.7)", border: "rgba(255,255,255,0.18)" }
  const styles = createPdfStyles(tokens)
  const { personal } = data
  const sidebar = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref) && pdfSectionHasContent(s, data))
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref) && pdfSectionHasContent(s, data))

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0, flexDirection: "row" }]}>
        <View
          style={{
            width: "36%",
            backgroundColor: "#1f2937",
            alignItems: "center",
            padding: `${tokens.spacing.pageMargin * 1.2}mm ${tokens.spacing.pageMargin * 0.8}mm`,
          }}
        >
          {showPhoto && (
            <PdfProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} size={92} backgroundColor={tokens.accent} />
          )}
          <Text style={{ fontSize: tokens.size.xl, fontWeight: 700, color: "#ffffff", marginTop: 8, textAlign: "center" }}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.role && (
            <Text style={{ fontSize: tokens.size.sm, fontWeight: 600, color: tokens.accent, marginTop: 2, textAlign: "center" }}>
              {personal.role}
            </Text>
          )}

          <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.18)", width: "100%", marginVertical: 10 }} />

          <View style={{ width: "100%" }}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} color="rgba(229,231,235,0.9)" />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} color="rgba(229,231,235,0.9)" />
            <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} color="rgba(229,231,235,0.9)" />
            <PdfContactField icon="globe" value={personal.website} tokens={tokens} color="rgba(229,231,235,0.9)" />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} color="rgba(229,231,235,0.9)" />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} color="rgba(229,231,235,0.9)" />
          </View>

          <View style={{ width: "100%", marginTop: 12 }}>
            {sidebar.map((meta) => (
              <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={sidebarTokens} />
            ))}
          </View>
        </View>

        <View style={{ flex: 1, padding: `${tokens.spacing.pageMargin}mm` }}>
          {main.map((meta, i) => (
            <View key={meta.ref} style={i < main.length - 1 ? { borderBottomWidth: 1, borderBottomColor: tokens.border, paddingBottom: 4 } : undefined}>
              <PdfSectionContent meta={meta} data={data} tokens={tokens} />
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
