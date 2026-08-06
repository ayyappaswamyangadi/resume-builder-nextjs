import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ProfilePhoto } from "@/components/templates/primitives/ProfilePhoto"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"

/** Portrait Clean — large centered circular photo, centered name/role, calm accent line, single column body. */
export function PortraitCleanPreview({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header className="flex flex-col items-center text-center">
        {showPhoto && (
          <ProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} size={112} shape="circle" />
        )}
        <h1 className="mt-3 text-[var(--tpl-size-xxl)] font-bold" style={{ color: tokens.primary }}>
          {personal.fullName || "Your Name"}
        </h1>
        {personal.role && (
          <p className="mt-0.5 text-[var(--tpl-size-lg)]" style={{ color: tokens.accent }}>
            {personal.role}
          </p>
        )}
        <div className="my-2 h-0.5 w-16" style={{ backgroundColor: tokens.accent }} aria-hidden="true" />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[var(--tpl-size-xs)] text-[var(--tpl-muted)]">
          <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
          <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
          <ContactItem icon={MapPin} iconStyle={tokens.iconStyle}>{personal.address}</ContactItem>
          <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.portfolio}</ContactItem>
          <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
          <ContactItem icon={GithubIcon} iconStyle={tokens.iconStyle}>{personal.github}</ContactItem>
        </div>
      </header>

      <div className="mt-5 flex flex-col" style={{ gap: tokens.spacing.section }}>
        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => (
            <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />
          ))}
      </div>
    </A4Page>
  )
}
