import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactInlineLine } from "@/components/templates/primitives/ContactInlineLine"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

/**
 * Scholar Research — the Scholar academic structure, but reordered so
 * publications and certifications surface immediately after the header,
 * ahead of everything else (research-CV convention).
 */
export function ScholarResearchPreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  const sections = sectionOrder.filter((s) => s.ref !== "personal")
  const priority = sections.filter((s) => s.ref === "publications" || s.ref === "certifications")
  const rest = sections.filter((s) => s.ref !== "publications" && s.ref !== "certifications")
  const ordered = [...priority, ...rest]

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header className="text-center">
        <h1 className="text-[var(--tpl-size-xxl)] font-semibold">{personal.fullName || "Your Name"}</h1>
        {personal.role && (
          <p className="mt-1 text-[var(--tpl-size-base)] italic text-[var(--tpl-muted)]">{personal.role}</p>
        )}
        <div className="mx-auto mt-3 flex w-40 flex-col items-center gap-[3px]" aria-hidden="true">
          <div className="h-px w-full" style={{ backgroundColor: tokens.border }} />
          <div className="h-px w-full" style={{ backgroundColor: tokens.border }} />
        </div>
        <ContactInlineLine
          items={[{ value: personal.email, kind: "email" }, { value: personal.phone }, { value: personal.address }, { value: personal.linkedin, kind: "linkedin" }, { value: personal.portfolio, kind: "portfolio" }]}
          separator="   ·   "
          className="mt-3 text-[var(--tpl-size-xs)]"
        />
      </header>

      <div className="mt-5 flex flex-col" style={{ gap: tokens.spacing.section * 1.15 }}>
        {ordered.map((meta) => (
          <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />
        ))}
      </div>
    </A4Page>
  )
}
