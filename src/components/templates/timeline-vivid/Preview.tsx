import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock, sectionHasContent } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"

/** Timeline Vivid — bold dotted timeline in a punchy palette, for engineers and builders. */
export function TimelineVividPreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data
  const sections = sectionOrder.filter((s) => s.ref !== "personal" && sectionHasContent(s, data))

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header className="border-b-4 pb-3" style={{ borderColor: tokens.primary }}>
        <h1 className="text-[var(--tpl-size-xxl)] font-bold leading-tight">{personal.fullName || "Your Name"}</h1>
        {personal.role && <p className="mt-0.5 text-[var(--tpl-size-lg)] text-[var(--tpl-muted)]">{personal.role}</p>}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[var(--tpl-size-xs)]">
          <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
          <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
          <ContactItem icon={MapPin} iconStyle={tokens.iconStyle}>{personal.address}</ContactItem>
          <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.portfolio}</ContactItem>
          <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
          <ContactItem icon={GithubIcon} iconStyle={tokens.iconStyle}>{personal.github}</ContactItem>
        </div>
      </header>

      <div className="relative mt-5 flex flex-col pl-5" style={{ gap: tokens.spacing.section }}>
        <div
          className="absolute top-0 w-px"
          style={{ left: "4px", height: "100%", backgroundColor: tokens.border }}
          aria-hidden="true"
        />
        {sections.map((meta) => (
          <div key={meta.ref} className="relative">
            <span
              className="absolute size-3 rounded-full"
              style={{ left: "-1.3rem", top: "0.2rem", backgroundColor: tokens.accent }}
              aria-hidden="true"
            />
            <ResumeSectionBlock meta={meta} data={data} tokens={tokens} />
          </div>
        ))}
      </div>
    </A4Page>
  )
}
