import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactInlineLine } from "@/components/templates/primitives/ContactInlineLine"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

/** Modern ATS — single column, black & white, no icons/photo. Built for applicant tracking systems. */
export function ModernAtsPreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header className="mb-4 border-b-2 border-[var(--tpl-text)] pb-3 text-center">
        <h1 className="text-[var(--tpl-size-xxl)] font-bold uppercase tracking-wide">
          {personal.fullName || "Your Name"}
        </h1>
        {personal.role && <p className="mt-0.5 text-[var(--tpl-size-lg)]">{personal.role}</p>}
        <ContactInlineLine
          items={[{ value: personal.email, kind: "email" }, { value: personal.phone }, { value: personal.address }, { value: personal.linkedin, kind: "linkedin" }, { value: personal.portfolio, kind: "portfolio" }]}
          separator="  |  "
          className="mt-1.5 text-[var(--tpl-size-xs)]"
        />
      </header>

      <div className="flex flex-col" style={{ gap: tokens.spacing.section }}>
        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />)}
      </div>
    </A4Page>
  )
}
