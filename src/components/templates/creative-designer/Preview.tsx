import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ProfilePhoto } from "@/components/templates/primitives/ProfilePhoto"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"
import type { CSSProperties } from "react"

const SIDEBAR_VARS: CSSProperties = {
  "--tpl-primary": "#ffffff",
  "--tpl-text": "#ffffff",
  "--tpl-muted": "rgba(255,255,255,0.8)",
  "--tpl-border": "rgba(255,255,255,0.35)",
} as CSSProperties

const SIDEBAR_REFS = new Set(["skills", "languages", "hobbies"])

/** Creative Designer — bold color-blocked header + photo, for design/creative portfolios. */
export function CreativeDesignerPreview({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data
  const sidebar = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref))
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref))

  return (
    <A4Page tokens={tokens} className="flex flex-col overflow-hidden">
      <header
        className="relative flex items-center gap-5 overflow-hidden px-[var(--tpl-page-margin)] py-7 text-white"
        style={{ backgroundColor: tokens.primary }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-14 size-40 rounded-full opacity-25"
          style={{ backgroundColor: tokens.accent }}
          aria-hidden="true"
        />
        {showPhoto && (
          <ProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} size={100} className="relative ring-4 ring-white/30" />
        )}
        <div className="relative min-w-0">
          <h1 className="text-[var(--tpl-size-xxl)] font-bold">{personal.fullName || "Your Name"}</h1>
          {personal.role && (
            <p className="text-[var(--tpl-size-lg)]" style={{ color: tokens.accent }}>
              {personal.role}
            </p>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-row">
        <aside
          className="flex w-[32%] shrink-0 flex-col text-white"
          style={{ backgroundColor: tokens.accent, padding: `${tokens.spacing.pageMargin}mm ${tokens.spacing.pageMargin * 0.7}mm`, ...SIDEBAR_VARS }}
        >
          <div className="flex flex-col gap-1.5 text-[var(--tpl-size-xs)]">
            <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
            <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
            <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.website}</ContactItem>
            <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
            <ContactItem icon={GithubIcon} iconStyle={tokens.iconStyle}>{personal.github}</ContactItem>
          </div>
          <div className="mt-5 flex flex-col" style={{ gap: tokens.spacing.section }}>
            {sidebar.map((meta) => (
              <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} dense />
            ))}
          </div>
        </aside>

        <main className="flex flex-1 flex-col" style={{ padding: `${tokens.spacing.pageMargin}mm`, gap: tokens.spacing.section }}>
          {main.map((meta) => (
            <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />
          ))}
        </main>
      </div>
    </A4Page>
  )
}
