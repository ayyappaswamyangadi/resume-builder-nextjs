import type { CSSProperties } from "react"
import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock, sectionHasContent } from "@/components/templates/primitives/ResumeSectionBlock"
import { ProfilePhoto } from "@/components/templates/primitives/ProfilePhoto"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"

const SIDEBAR_VARS: CSSProperties = {
  "--tpl-primary": "#ffffff",
  "--tpl-text": "#e5e7eb",
  "--tpl-muted": "rgba(229,231,235,0.7)",
  "--tpl-border": "rgba(255,255,255,0.18)",
} as CSSProperties

const SIDEBAR_REFS = new Set(["skills", "languages", "certifications", "hobbies", "references"])

/** Premium Portfolio — the flagship template: refined dark sidebar, photo, and structured main column. */
export function PremiumPortfolioPreview({ data, sectionOrder, customization, showPhoto }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data
  const sidebar = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref))
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref) && sectionHasContent(s, data))

  return (
    <A4Page tokens={tokens} className="flex flex-row overflow-hidden">
      <aside
        className="flex w-[36%] shrink-0 flex-col items-center text-center"
        style={{ backgroundColor: "#1f2937", padding: `${tokens.spacing.pageMargin * 1.2}mm ${tokens.spacing.pageMargin * 0.8}mm`, ...SIDEBAR_VARS }}
      >
        {showPhoto && (
          <ProfilePhoto
            photoUrl={personal.photoUrl}
            fullName={personal.fullName}
            size={104}
            className="ring-4"
            placeholderColor={tokens.accent}
          />
        )}
        <h1 className="mt-3 text-[var(--tpl-size-xl)] font-bold text-white">{personal.fullName || "Your Name"}</h1>
        {personal.role && (
          <p className="mt-0.5 text-[var(--tpl-size-sm)] font-medium" style={{ color: tokens.accent }}>
            {personal.role}
          </p>
        )}

        <div
          className="my-4 h-px w-full"
          style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
          aria-hidden="true"
        />

        <div className="flex w-full flex-col items-start gap-1.5 text-[var(--tpl-size-xs)]">
          <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
          <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
          <ContactItem icon={MapPin} iconStyle={tokens.iconStyle}>{personal.address}</ContactItem>
          <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.website}</ContactItem>
          <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
          <ContactItem icon={GithubIcon} iconStyle={tokens.iconStyle}>{personal.github}</ContactItem>
        </div>

        <div className="mt-5 flex w-full flex-col items-start" style={{ gap: tokens.spacing.section }}>
          {sidebar.filter((s) => sectionHasContent(s, data)).map((meta) => (
            <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} dense />
          ))}
        </div>
      </aside>

      <main
        className="flex flex-1 flex-col"
        style={{ padding: `${tokens.spacing.pageMargin}mm`, gap: tokens.spacing.section * 1.1 }}
      >
        {main.map((meta, i) => (
          <div key={meta.ref}>
            <ResumeSectionBlock meta={meta} data={data} tokens={tokens} />
            {i < main.length - 1 && (
              <div className="mt-[var(--tpl-gap-section)] h-px w-full" style={{ backgroundColor: tokens.border }} aria-hidden="true" />
            )}
          </div>
        ))}
      </main>
    </A4Page>
  )
}
