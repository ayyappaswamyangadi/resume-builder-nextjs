import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock, sectionHasContent } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactInlineLine } from "@/components/templates/primitives/ContactInlineLine"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

/** Linework Slate — left-aligned hairline layout in cool slate, the most understated template in the set. */
export function LineworkSlatePreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header>
        <h1 className="text-[var(--tpl-size-xxl)] font-normal">{personal.fullName || "Your Name"}</h1>
        {personal.role && (
          <p className="mt-1 text-[var(--tpl-size-xs)] uppercase tracking-[0.15em] text-[var(--tpl-muted)]">
            {personal.role}
          </p>
        )}
        <div className="mt-3 h-px w-full" style={{ backgroundColor: tokens.accent }} aria-hidden="true" />
        <ContactInlineLine
          items={[{ value: personal.email, kind: "email" }, { value: personal.phone }, { value: personal.address }, { value: personal.portfolio, kind: "portfolio" }, { value: personal.linkedin, kind: "linkedin" }, { value: personal.github, kind: "github" }]}
          separator="   ·   "
          className="mt-3 text-[var(--tpl-size-xs)]"
        />
      </header>

      <div className="mt-6 flex flex-col" style={{ gap: tokens.spacing.section * 1.2 }}>
        {sectionOrder
          .filter((s) => s.ref !== "personal" && sectionHasContent(s, data))
          .map((meta) => (
            <div key={meta.ref} className="border-b pb-3" style={{ borderColor: tokens.border }}>
              <ResumeSectionBlock meta={meta} data={data} tokens={tokens} />
            </div>
          ))}
      </div>
    </A4Page>
  )
}
