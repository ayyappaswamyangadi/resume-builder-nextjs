import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"

/** Minimal Elegant — quiet, whitespace-forward single column for students and minimalists. */
export function MinimalElegantPreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin * 1.2}mm ${tokens.spacing.pageMargin}mm` }}>
      <header className="mb-6 text-center">
        <h1 className="text-[var(--tpl-size-xxl)] font-light tracking-wide" style={{ color: tokens.primary }}>
          {personal.fullName || "Your Name"}
        </h1>
        {personal.role && (
          <p className="mt-1 text-[var(--tpl-size-base)] tracking-[0.2em] text-[var(--tpl-muted)] uppercase">
            {personal.role}
          </p>
        )}
        <div
          className="mx-auto my-3 h-px w-16"
          style={{ backgroundColor: tokens.accent }}
          aria-hidden="true"
        />
        <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)]">
          {[personal.email, personal.phone, personal.address, personal.website, personal.linkedin]
            .filter(Boolean)
            .join("   ·   ")}
        </p>
      </header>

      <div className="flex flex-col" style={{ gap: tokens.spacing.section * 1.1 }}>
        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />)}
      </div>
    </A4Page>
  )
}
