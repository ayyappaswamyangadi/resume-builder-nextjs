import type { CSSProperties } from "react"
import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"

const SIDEBAR_VARS: CSSProperties = {
  "--tpl-primary": "#ffffff",
  "--tpl-text": "#ffffff",
  "--tpl-muted": "rgba(255,255,255,0.75)",
  "--tpl-border": "rgba(255,255,255,0.35)",
} as CSSProperties

const SIDEBAR_REFS = new Set(["skills", "languages", "certifications", "hobbies", "references"])

/** Right Rail Crimson — a confident sidebar layout that keeps the main narrative on the left. */
export function RightRailCrimsonPreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data
  const sidebar = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref))
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref))

  return (
    <A4Page tokens={tokens} className="flex flex-row-reverse overflow-hidden">
      <aside
        className="flex w-[34%] shrink-0 flex-col text-white"
        style={{
          backgroundColor: tokens.primary,
          padding: `${tokens.spacing.pageMargin}mm ${tokens.spacing.pageMargin * 0.7}mm`,
          ...SIDEBAR_VARS,
        }}
      >
        <h1 className="text-[var(--tpl-size-xl)] font-bold leading-tight">{personal.fullName || "Your Name"}</h1>
        {personal.role && <p className="mt-1 text-[var(--tpl-size-sm)] text-white/85">{personal.role}</p>}

        <div className="mt-4 flex flex-col gap-1.5 text-[var(--tpl-size-xs)] text-white/90">
          <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
          <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
          <ContactItem icon={MapPin} iconStyle={tokens.iconStyle}>{personal.address}</ContactItem>
          <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.portfolio}</ContactItem>
          <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
          <ContactItem icon={GithubIcon} iconStyle={tokens.iconStyle}>{personal.github}</ContactItem>
        </div>

        <div className="mt-5 flex flex-col" style={{ gap: tokens.spacing.section }}>
          {sidebar.map((meta) => (
            <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} dense />
          ))}
        </div>
      </aside>

      <main
        className="flex flex-1 flex-col"
        style={{ padding: `${tokens.spacing.pageMargin}mm`, gap: tokens.spacing.section }}
      >
        {main.map((meta) => (
          <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />
        ))}
      </main>
    </A4Page>
  )
}
