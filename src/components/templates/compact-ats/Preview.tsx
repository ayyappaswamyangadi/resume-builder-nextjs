import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"

/** Compact ATS — dense, no-photo single-page column with tight spacing throughout. */
export function CompactAtsPreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header className="mb-2 border-b pb-1.5" style={{ borderColor: tokens.border, borderBottomWidth: 1 }}>
        <h1 className="text-[var(--tpl-size-xxl)] font-bold leading-tight">{personal.fullName || "Your Name"}</h1>
        {personal.role && <p className="text-[var(--tpl-size-base)] leading-tight" style={{ color: tokens.accent }}>{personal.role}</p>}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[var(--tpl-size-xs)] text-[var(--tpl-muted)]">
          <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
          <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
          <ContactItem icon={MapPin} iconStyle={tokens.iconStyle}>{personal.address}</ContactItem>
          <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.portfolio}</ContactItem>
          <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
        </div>
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
