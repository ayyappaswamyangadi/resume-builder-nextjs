import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ProfilePhoto } from "@/components/templates/primitives/ProfilePhoto"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"

/** Duotone Blue — vertical two-tone header block (primary/accent) with the photo centered on the seam. */
export function DuotoneBluePreview({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens} className="flex flex-col overflow-hidden">
      <header className="relative flex flex-col items-center justify-center overflow-hidden py-8 text-white">
        <div className="absolute inset-0 flex flex-row" aria-hidden="true">
          <div className="flex-1" style={{ backgroundColor: tokens.primary }} />
          <div className="flex-1" style={{ backgroundColor: tokens.accent }} />
        </div>

        <div className="relative z-10 flex flex-col items-center px-[var(--tpl-page-margin)] text-center">
          {showPhoto && (
            <ProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} size={104} className="ring-4 ring-white" />
          )}
          <h1 className="mt-3 text-[var(--tpl-size-xxl)] font-bold text-white">{personal.fullName || "Your Name"}</h1>
          {personal.role && <p className="mt-0.5 text-[var(--tpl-size-lg)] text-white/90">{personal.role}</p>}
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[var(--tpl-size-xs)] text-white/90">
            <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
            <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
            <ContactItem icon={MapPin} iconStyle={tokens.iconStyle}>{personal.address}</ContactItem>
            <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.portfolio}</ContactItem>
            <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
            <ContactItem icon={GithubIcon} iconStyle={tokens.iconStyle}>{personal.github}</ContactItem>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col" style={{ padding: `${tokens.spacing.pageMargin}mm`, gap: tokens.spacing.section }}>
        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => (
            <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />
          ))}
      </div>
    </A4Page>
  )
}
