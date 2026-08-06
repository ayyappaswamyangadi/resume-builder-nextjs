import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

const SIDEBAR_REFS = new Set(["skills", "languages", "certifications", "hobbies", "references"])

export function RightRailSlateDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const sidebarTokens = { ...tokens, primary: "#ffffff", text: "#ffffff", muted: "rgba(255,255,255,0.75)" }
  const styles = createPdfStyles(tokens)
  const { personal } = data
  const sidebar = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref))
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref))

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0, flexDirection: "row" }]}>
        <View style={{ flex: 1, padding: `${tokens.spacing.pageMargin}mm` }}>
          {main.map((meta) => (
            <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={tokens} />
          ))}
        </View>

        <View style={{ width: "34%", backgroundColor: tokens.primary, padding: `${tokens.spacing.pageMargin}mm ${tokens.spacing.pageMargin * 0.7}mm` }}>
          <Text style={{ fontSize: tokens.size.xl, lineHeight: 1.2, fontWeight: 700, color: "#ffffff" }}>{personal.fullName || "Your Name"}</Text>
          {personal.role && <Text style={{ fontSize: tokens.size.sm, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{personal.role}</Text>}

          <View style={{ marginTop: 10 }}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} color="rgba(255,255,255,0.9)" />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} color="rgba(255,255,255,0.9)" />
            <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} color="rgba(255,255,255,0.9)" />
            <PdfContactField icon="globe" value={personal.portfolio} tokens={tokens} color="rgba(255,255,255,0.9)" />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} color="rgba(255,255,255,0.9)" />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} color="rgba(255,255,255,0.9)" />
          </View>

          <View style={{ marginTop: 12 }}>
            {sidebar.map((meta) => (
              <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={sidebarTokens} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}
