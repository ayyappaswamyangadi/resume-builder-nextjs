import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock, sectionHasContent } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactInlineLine } from "@/components/templates/primitives/ContactInlineLine"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

/** Classic Resume — traditional centered header with full-width section rules. */
export function ClassicResumePreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header className="text-center">
        <h1 className="text-[var(--tpl-size-xxl)] font-bold">{personal.fullName || "Your Name"}</h1>
        {personal.role && <p className="text-[var(--tpl-size-base)] italic text-[var(--tpl-muted)]">{personal.role}</p>}
        <ContactInlineLine
          items={[{ value: personal.address }, { value: personal.phone }, { value: personal.email, kind: "email" }, { value: personal.linkedin, kind: "linkedin" }]}
          separator=" | "
          className="mt-1 text-[var(--tpl-size-xs)]"
        />
      </header>

      <div className="mt-4 flex flex-col" style={{ gap: tokens.spacing.section }}>
        {sectionOrder
          .filter((s) => s.ref !== "personal" && sectionHasContent(s, data))
          .map((meta) => (
            <div key={meta.ref} className="border-t pt-2" style={{ borderColor: tokens.border }}>
              <ResumeSectionBlock meta={meta} data={data} tokens={tokens} />
            </div>
          ))}
      </div>
    </A4Page>
  )
}
