import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

export function GridHeaderSageDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data

  const contacts = (
    [
      { icon: "mail", value: personal.email },
      { icon: "phone", value: personal.phone },
      { icon: "mapPin", value: personal.address },
      { icon: "globe", value: personal.portfolio },
      { icon: "linkedin", value: personal.linkedin },
      { icon: "github", value: personal.github },
    ] as const
  ).filter((c) => c.value)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: tokens.border, paddingBottom: 8, marginBottom: 12 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700 }}>{personal.fullName || "Your Name"}</Text>
            {personal.role && (
              <Text style={{ fontSize: tokens.size.lg, color: tokens.accent, marginTop: 2 }}>{personal.role}</Text>
            )}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {contacts.map((c, i) => (
              <View key={i} style={{ width: "32%" }}>
                <PdfContactField icon={c.icon} value={c.value} tokens={tokens} />
              </View>
            ))}
          </View>
        </View>

        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => (
            <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={tokens} />
          ))}
      </Page>
    </Document>
  )
}
