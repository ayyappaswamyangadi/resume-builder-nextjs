import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { PdfProfilePhoto } from "@/components/pdf/primitives/PdfProfilePhoto"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

const SIDEBAR_REFS = new Set(["skills", "languages", "hobbies"])

export function CreativeDesignerDocument({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const sidebarTokens = { ...tokens, primary: "#ffffff", text: "#ffffff", muted: "rgba(255,255,255,0.85)" }
  const styles = createPdfStyles(tokens)
  const { personal } = data
  const sidebar = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref))
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref))

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: tokens.primary, padding: `${tokens.spacing.pageMargin}mm` }}>
          {showPhoto && <PdfProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} size={76} backgroundColor={tokens.accent} />}
          <View>
            <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700, color: "#ffffff" }}>{personal.fullName || "Your Name"}</Text>
            {personal.role && <Text style={{ fontSize: tokens.size.lg, color: tokens.accent }}>{personal.role}</Text>}
          </View>
        </View>

        <View style={{ flexDirection: "row", flex: 1 }}>
          <View style={{ width: "32%", backgroundColor: tokens.accent, padding: `${tokens.spacing.pageMargin}mm ${tokens.spacing.pageMargin * 0.7}mm` }}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} color="#ffffff" />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} color="#ffffff" />
            <PdfContactField icon="globe" value={personal.portfolio} tokens={tokens} color="#ffffff" />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} color="#ffffff" />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} color="#ffffff" />
            <View style={{ marginTop: 12 }}>
              {sidebar.map((meta) => (
                <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={sidebarTokens} />
              ))}
            </View>
          </View>
          <View style={{ flex: 1, padding: `${tokens.spacing.pageMargin}mm` }}>
            {main.map((meta) => (
              <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={tokens} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}
