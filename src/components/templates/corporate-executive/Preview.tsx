import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ProfilePhoto } from "@/components/templates/primitives/ProfilePhoto"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"

/** Corporate Executive — formal header with photo, ideal for senior/leadership roles. */
export function CorporateExecutivePreview({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  return (
    <A4Page tokens={tokens}>
      <header
        className="flex items-center gap-5 border-b-4 px-[var(--tpl-page-margin)] py-6"
        style={{ borderColor: tokens.primary, backgroundColor: tokens.surface }}
      >
        {showPhoto && <ProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} shape="square" size={92} />}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[var(--tpl-size-xxl)] font-bold" style={{ color: tokens.primary }}>
            {personal.fullName || "Your Name"}
          </h1>
          {personal.role && (
            <p className="text-[var(--tpl-size-lg)] font-medium" style={{ color: tokens.accent }}>
              {personal.role}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[var(--tpl-size-xs)] text-[var(--tpl-muted)]">
            <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
            <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
            <ContactItem icon={MapPin} iconStyle={tokens.iconStyle}>{personal.address}</ContactItem>
            <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.portfolio}</ContactItem>
            <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
          </div>
        </div>
      </header>

      <div
        className="flex flex-col"
        style={{ padding: `${tokens.spacing.pageMargin}mm`, gap: tokens.spacing.section }}
      >
        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />)}
      </div>
    </A4Page>
  )
}
