import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock, sectionHasContent } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactInlineLine } from "@/components/templates/primitives/ContactInlineLine"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

/** Material Style — elevated cards per section, Google-Material inspired. */
export function MaterialStylePreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data
  const sections = sectionOrder.filter((s) => s.ref !== "personal" && sectionHasContent(s, data))

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm`, backgroundColor: "#f3f4f6" }}>
      <header
        className="mb-4 rounded-[var(--tpl-radius)] px-6 py-5 text-white shadow-md"
        style={{ backgroundColor: tokens.primary }}
      >
        <h1 className="text-[var(--tpl-size-xxl)] font-medium">{personal.fullName || "Your Name"}</h1>
        {personal.role && <p className="text-[var(--tpl-size-lg)] text-white/90">{personal.role}</p>}
        <ContactInlineLine
          items={[{ value: personal.email, kind: "email" }, { value: personal.phone }, { value: personal.address }, { value: personal.portfolio, kind: "portfolio" }, { value: personal.linkedin, kind: "linkedin" }]}
          separator="  •  "
          className="mt-2 text-[var(--tpl-size-xs)] text-white/85"
        />
      </header>

      <div className="flex flex-col" style={{ gap: tokens.spacing.section * 0.8 }}>
        {sections.map((meta) => (
          <div
            key={meta.ref}
            className="rounded-[var(--tpl-radius)] bg-white px-5 py-4 shadow-sm"
            style={{ borderTop: `3px solid ${tokens.accent}` }}
          >
            <ResumeSectionBlock meta={meta} data={data} tokens={tokens} />
          </div>
        ))}
      </div>
    </A4Page>
  )
}
