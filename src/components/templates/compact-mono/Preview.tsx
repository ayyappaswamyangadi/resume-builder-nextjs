import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactInlineLine } from "@/components/templates/primitives/ContactInlineLine"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

/** Compact Sharp — dense, no-photo single-page column; contact info renders as one plain text line (no icons). */
export function CompactSharpPreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header className="mb-2 border-b pb-1.5" style={{ borderColor: tokens.border, borderBottomWidth: 1 }}>
        <h1 className="text-[var(--tpl-size-xxl)] font-bold uppercase leading-tight tracking-wide">
          {personal.fullName || "Your Name"}
        </h1>
        {personal.role && <p className="text-[var(--tpl-size-base)] leading-tight" style={{ color: tokens.accent }}>{personal.role}</p>}
        <ContactInlineLine
          items={[{ value: personal.email, kind: "email" }, { value: personal.phone }, { value: personal.address }, { value: personal.portfolio, kind: "portfolio" }]}
          separator="  |  "
          className="mt-1 text-[var(--tpl-size-xs)] text-[var(--tpl-muted)]"
        />
      </header>

      <div className="flex flex-col" style={{ gap: tokens.spacing.section * 0.7 }}>
        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => (
            <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} dense />
          ))}
      </div>
    </A4Page>
  )
}
