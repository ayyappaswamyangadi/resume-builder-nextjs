import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"

/** Grid Header Rose — name/role header with contact details laid out as a warm three-column grid. */
export function GridHeaderRosePreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data

  const contacts = [
    { icon: Mail, value: personal.email },
    { icon: Phone, value: personal.phone },
    { icon: MapPin, value: personal.address },
    { icon: Globe, value: personal.portfolio },
    { icon: LinkedinIcon, value: personal.linkedin },
    { icon: GithubIcon, value: personal.github },
  ].filter((c) => c.value)

  return (
    <A4Page tokens={tokens} style={{ padding: `${tokens.spacing.pageMargin}mm` }}>
      <header className="mb-4 border-b pb-3" style={{ borderColor: tokens.border }}>
        <div className="mb-3">
          <h1 className="text-[var(--tpl-size-xxl)] font-bold">{personal.fullName || "Your Name"}</h1>
          {personal.role && (
            <p className="mt-1 text-[var(--tpl-size-lg)]" style={{ color: tokens.accent }}>
              {personal.role}
            </p>
          )}
        </div>
        <div className="grid gap-x-6 gap-y-1 text-[var(--tpl-size-xs)]" style={{ gridTemplateColumns: "repeat(3, auto)" }}>
          {contacts.map((c, i) => (
            <ContactItem key={i} icon={c.icon} iconStyle={tokens.iconStyle}>
              {c.value}
            </ContactItem>
          ))}
        </div>
      </header>

      <div className="flex flex-col" style={{ gap: tokens.spacing.section }}>
        {sectionOrder
          .filter((s) => s.ref !== "personal")
          .map((meta) => <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />)}
      </div>
    </A4Page>
  )
}
