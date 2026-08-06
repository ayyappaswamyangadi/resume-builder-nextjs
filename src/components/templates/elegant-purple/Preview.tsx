import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"

const SIDEBAR_REFS = new Set(["skills", "languages", "certifications", "achievements", "hobbies"])

/** Elegant Purple — soft banner header with a light, airy two-column body. */
export function ElegantPurplePreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data
  const sidebar = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref))
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref))

  return (
    <A4Page tokens={tokens} className="overflow-hidden">
      <header
        className="px-[var(--tpl-page-margin)] py-6"
        style={{ backgroundColor: `color-mix(in oklch, ${tokens.primary}, white 88%)` }}
      >
        <h1 className="text-[var(--tpl-size-xxl)] font-semibold" style={{ color: tokens.primary }}>
          {personal.fullName || "Your Name"}
        </h1>
        {personal.role && <p className="text-[var(--tpl-size-lg)] text-[var(--tpl-muted)]">{personal.role}</p>}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[var(--tpl-size-xs)]">
          <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
          <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
          <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.portfolio}</ContactItem>
          <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
          <ContactItem icon={GithubIcon} iconStyle={tokens.iconStyle}>{personal.github}</ContactItem>
        </div>
      </header>

      <div className="flex flex-row" style={{ padding: `${tokens.spacing.pageMargin}mm`, gap: tokens.spacing.pageMargin }}>
        <main className="flex flex-[1.6] flex-col" style={{ gap: tokens.spacing.section }}>
          {main.map((meta) => (
            <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />
          ))}
        </main>
        <aside
          className="flex flex-1 flex-col border-l pl-4"
          style={{ borderColor: tokens.border, gap: tokens.spacing.section }}
        >
          {sidebar.map((meta) => (
            <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} dense />
          ))}
        </aside>
      </div>
    </A4Page>
  )
}
