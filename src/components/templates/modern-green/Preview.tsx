import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"

/** Modern Green — clean single column with a left accent rule on every heading. */
export function ModernGreenPreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header className="flex items-end justify-between gap-4 border-b pb-3" style={{ borderColor: tokens.primary }}>
        <div>
          <h1 className="text-[var(--tpl-size-xxl)] font-bold" style={{ color: tokens.primary }}>
            {personal.fullName || "Your Name"}
          </h1>
          {personal.role && <p className="text-[var(--tpl-size-lg)] text-[var(--tpl-muted)]">{personal.role}</p>}
        </div>
      </header>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-b pb-3 text-[var(--tpl-size-xs)]" style={{ borderColor: tokens.border }}>
        <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
        <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
        <ContactItem icon={MapPin} iconStyle={tokens.iconStyle}>{personal.address}</ContactItem>
        <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.portfolio}</ContactItem>
        <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
        <ContactItem icon={GithubIcon} iconStyle={tokens.iconStyle}>{personal.github}</ContactItem>
      </div>

      <div className="mt-4 flex flex-col [&_h3]:border-l-4 [&_h3]:pl-2" style={{ gap: tokens.spacing.section }}>
        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />)}
      </div>
    </A4Page>
  )
}
