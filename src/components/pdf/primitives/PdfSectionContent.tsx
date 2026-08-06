import { Text, View } from "@react-pdf/renderer"
import { PdfSectionHeading } from "@/components/pdf/primitives/PdfSectionHeading"
import { PdfBullets } from "@/components/pdf/primitives/PdfBullets"
import { renderRichTextToPdf } from "@/components/pdf/richtext/renderRichTextToPdf"
import { sectionHasContent } from "@/components/templates/primitives/ResumeSectionBlock"
import { formatDateRange, formatMonthYear } from "@/lib/format"
import type { ResolvedTokens } from "@/lib/templates/tokens"
import type { ResumeData, SectionMeta } from "@/types/resume"

export { sectionHasContent as pdfSectionHasContent }

/** react-pdf counterpart to <ResumeSectionBlock>: one section's heading + content, per section type. */
export function PdfSectionContent({
  meta,
  data,
  tokens,
}: {
  meta: SectionMeta
  data: ResumeData
  tokens: ResolvedTokens
}) {
  if (!meta.visible || !sectionHasContent(meta, data)) return null

  return (
    <View style={{ marginBottom: tokens.spacing.section }} wrap={false}>
      <PdfSectionHeading tokens={tokens}>{meta.label}</PdfSectionHeading>
      <View style={{ gap: tokens.spacing.item }}>{renderBody(meta, data, tokens)}</View>
    </View>
  )
}

function renderBody(meta: SectionMeta, data: ResumeData, tokens: ResolvedTokens) {
  const ref = meta.ref
  const small = { fontSize: tokens.size.sm }
  const xsmall = { fontSize: tokens.size.xs, color: tokens.muted }
  const bold = { fontWeight: 700 as const }
  const rowBetween = { flexDirection: "row" as const, justifyContent: "space-between" as const }

  if (ref === "summary") return data.summary ? renderRichTextToPdf(data.summary, small, tokens.muted) : null
  if (ref === "objective") return data.objective ? renderRichTextToPdf(data.objective, small, tokens.muted) : null
  if (ref === "hobbies") return data.hobbies.length ? <Text style={small}>{data.hobbies.join(" · ")}</Text> : null

  if (ref === "experience") {
    return data.experience.map((item) => (
      <View key={item.id} style={{ marginBottom: 4 }} wrap={false}>
        <View style={rowBetween}>
          <Text style={[small, bold]}>
            {item.role}
            {item.company ? ` · ${item.company}` : ""}
          </Text>
          <Text style={xsmall}>{formatDateRange(item.startDate, item.endDate, item.current)}</Text>
        </View>
        {item.location && <Text style={xsmall}>{item.location}</Text>}
        <PdfBullets items={item.bullets} tokens={tokens} />
      </View>
    ))
  }

  if (ref === "education") {
    return data.education.map((item) => (
      <View key={item.id} style={{ marginBottom: 4 }} wrap={false}>
        <View style={rowBetween}>
          <Text style={[small, bold]}>
            {item.degree}
            {item.field ? ` in ${item.field}` : ""}
          </Text>
          <Text style={xsmall}>{formatDateRange(item.startDate, item.endDate)}</Text>
        </View>
        <Text style={small}>
          {[item.institution, item.location, item.grade].filter(Boolean).join(" · ")}
        </Text>
        {item.description ? renderRichTextToPdf(item.description, small, tokens.muted) : null}
      </View>
    ))
  }

  if (ref === "projects") {
    return data.projects.map((item) => (
      <View key={item.id} style={{ marginBottom: 4 }} wrap={false}>
        <View style={rowBetween}>
          <Text style={[small, bold]}>{item.name}</Text>
          <Text style={xsmall}>{formatDateRange(item.startDate, item.endDate)}</Text>
        </View>
        {item.description ? renderRichTextToPdf(item.description, small, tokens.muted) : null}
        {item.techStack.length > 0 && <Text style={xsmall}>{item.techStack.join(" · ")}</Text>}
      </View>
    ))
  }

  if (ref === "skills") {
    return data.skills.map((group) => (
      <Text key={group.id} style={[small, { marginBottom: 2 }]}>
        <Text style={bold}>{group.category}: </Text>
        {group.items.join(", ")}
      </Text>
    ))
  }

  if (ref === "languages") {
    return <Text style={small}>{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" · ")}</Text>
  }

  if (ref === "achievements") {
    return data.achievements.map((item) => (
      <View key={item.id} style={{ marginBottom: 4 }} wrap={false}>
        <View style={rowBetween}>
          <Text style={[small, bold]}>{item.title}</Text>
          <Text style={xsmall}>{formatMonthYear(item.date)}</Text>
        </View>
        {item.description ? renderRichTextToPdf(item.description, small, tokens.muted) : null}
      </View>
    ))
  }

  if (ref === "certifications") {
    return data.certifications.map((item) => (
      <View key={item.id} style={[rowBetween, { marginBottom: 2 }]} wrap={false}>
        <Text style={small}>
          <Text style={bold}>{item.name}</Text>
          {item.issuer ? ` · ${item.issuer}` : ""}
        </Text>
        <Text style={xsmall}>{formatMonthYear(item.date)}</Text>
      </View>
    ))
  }

  if (ref === "publications") {
    return data.publications.map((item) => (
      <View key={item.id} style={{ marginBottom: 4 }} wrap={false}>
        <View style={rowBetween}>
          <Text style={[small, bold]}>{item.title}</Text>
          <Text style={xsmall}>{formatMonthYear(item.date)}</Text>
        </View>
        {item.publisher && <Text style={xsmall}>{item.publisher}</Text>}
        {item.description ? renderRichTextToPdf(item.description, small, tokens.muted) : null}
      </View>
    ))
  }

  if (ref === "internships") {
    return data.internships.map((item) => (
      <View key={item.id} style={{ marginBottom: 4 }} wrap={false}>
        <View style={rowBetween}>
          <Text style={[small, bold]}>
            {item.role} · {item.company}
          </Text>
          <Text style={xsmall}>{formatDateRange(item.startDate, item.endDate)}</Text>
        </View>
        {item.description ? renderRichTextToPdf(item.description, small, tokens.muted) : null}
      </View>
    ))
  }

  if (ref === "volunteer") {
    return data.volunteer.map((item) => (
      <View key={item.id} style={{ marginBottom: 4 }} wrap={false}>
        <View style={rowBetween}>
          <Text style={[small, bold]}>
            {item.role} · {item.organization}
          </Text>
          <Text style={xsmall}>{formatDateRange(item.startDate, item.endDate)}</Text>
        </View>
        {item.description ? renderRichTextToPdf(item.description, small, tokens.muted) : null}
      </View>
    ))
  }

  if (ref === "references") {
    return data.references.map((item) => (
      <View key={item.id} style={{ marginBottom: 4 }} wrap={false}>
        <Text style={[small, bold]}>{item.name}</Text>
        <Text style={xsmall}>{[item.relationship, item.company].filter(Boolean).join(" · ")}</Text>
        <Text style={xsmall}>{[item.email, item.phone].filter(Boolean).join(" · ")}</Text>
      </View>
    ))
  }

  if (ref.startsWith("custom:")) {
    const section = data.customSections.find((s) => s.id === ref.slice(7))
    if (!section) return null
    return section.items.map((item) => (
      <View key={item.id} style={{ marginBottom: 4 }} wrap={false}>
        <View style={rowBetween}>
          <Text style={[small, bold]}>{item.heading}</Text>
          {item.date && <Text style={xsmall}>{formatMonthYear(item.date)}</Text>}
        </View>
        {item.subheading && <Text style={xsmall}>{item.subheading}</Text>}
        {item.description ? renderRichTextToPdf(item.description, small, tokens.muted) : null}
      </View>
    ))
  }

  return null
}
