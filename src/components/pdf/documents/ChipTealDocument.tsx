import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfSectionContent } from "@/components/pdf/primitives/PdfSectionContent"
import { PdfSectionHeading } from "@/components/pdf/primitives/PdfSectionHeading"
import { PdfContactField } from "@/components/pdf/primitives/PdfContactRow"
import { ensurePdfFontsRegistered } from "@/lib/pdf/fonts"
import { createPdfStyles } from "@/lib/pdf/styles"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

ensurePdfFontsRegistered()

const CHIP_REFS = new Set(["skills", "languages"])
const SIDEBAR_REFS = new Set(["skills", "languages", "certifications", "hobbies", "references"])

// react-pdf has no color-mix()/oklch support, so the chip fill is a flat light-gray
// literal standing in for "a light tint of the accent color" rather than a computed mix.
const CHIP_FILL = "#f1f5f9"

export function ChipTealDocument({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const styles = createPdfStyles(tokens)
  const { personal } = data
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref))
  const sidebarRest = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref) && !CHIP_REFS.has(s.ref))

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 0, flexDirection: "row" }]}>
        <View style={{ flex: 1, padding: `${tokens.spacing.pageMargin}mm` }}>
          <Text style={{ fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700, color: tokens.primary }}>
            {personal.fullName || "Your Name"}
          </Text>
          {personal.role && (
            <Text style={{ fontSize: tokens.size.lg, fontWeight: 600, color: tokens.accent, marginTop: 2 }}>
              {personal.role}
            </Text>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}>
            <PdfContactField icon="mail" value={personal.email} tokens={tokens} />
            <PdfContactField icon="phone" value={personal.phone} tokens={tokens} />
            <PdfContactField icon="mapPin" value={personal.address} tokens={tokens} />
            <PdfContactField icon="globe" value={personal.portfolio} tokens={tokens} />
            <PdfContactField icon="linkedin" value={personal.linkedin} tokens={tokens} />
            <PdfContactField icon="github" value={personal.github} tokens={tokens} />
          </View>

          <View style={{ marginTop: 10 }}>
            {main.map((meta) => (
              <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={tokens} />
            ))}
          </View>
        </View>

        <View
          style={{
            width: "35%",
            backgroundColor: tokens.surface,
            padding: `${tokens.spacing.pageMargin}mm ${tokens.spacing.pageMargin * 0.7}mm`,
          }}
        >
          {data.skills.length > 0 && (
            <View style={{ marginBottom: tokens.spacing.section }}>
              <PdfSectionHeading tokens={tokens}>Skills</PdfSectionHeading>
              {data.skills.map((group) => (
                <View key={group.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: tokens.size.xs, fontWeight: 700, color: tokens.muted, marginBottom: 3 }}>
                    {group.category}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                    {group.items.map((item) => (
                      <View
                        key={item}
                        style={{ backgroundColor: CHIP_FILL, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 }}
                      >
                        <Text style={{ fontSize: tokens.size.xs, color: tokens.primary }}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {data.languages.length > 0 && (
            <View style={{ marginBottom: tokens.spacing.section }}>
              <PdfSectionHeading tokens={tokens}>Languages</PdfSectionHeading>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                {data.languages.map((lang) => (
                  <View
                    key={lang.id}
                    style={{ backgroundColor: CHIP_FILL, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 }}
                  >
                    <Text style={{ fontSize: tokens.size.xs, color: tokens.primary }}>
                      {lang.name} · {lang.proficiency}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {sidebarRest.map((meta) => (
            <PdfSectionContent key={meta.ref} meta={meta} data={data} tokens={tokens} />
          ))}
        </View>
      </Page>
    </Document>
  )
}
