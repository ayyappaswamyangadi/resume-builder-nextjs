import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

const SIDEBAR_REFS = new Set(["skills", "languages", "certifications", "achievements", "hobbies"])

export function ElegantPurpleDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data
  const sidebar = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref))
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref))

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0 }]}>
        <View style={{ backgroundColor: `${tokens.primary}16`, padding: `${tokens.spacing.pageMargin}mm` }}>
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 600, color: tokens.primary }}>{personal.fullName || "Your Name"}</Text>
          {personal.role && <Text style={{ fontSize: tokens.size.lg, color: tokens.muted }}>{personal.role}</Text>}
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} />
            <PdfContactField icon="globe" value={personal.portfolio} tokens={tokens} />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} />
          </View>
        </View>

        <View style={{ flexDirection: "row", padding: `${tokens.spacing.pageMargin}mm`, gap: tokens.spacing.pageMargin }}>
          <View style={{ flex: 1.6 }}>
            {main.map((meta) => (
              <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={tokens} />
            ))}
          </View>
          <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: tokens.border, paddingLeft: 10 }}>
            {sidebar.map((meta) => (
              <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={tokens} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}
