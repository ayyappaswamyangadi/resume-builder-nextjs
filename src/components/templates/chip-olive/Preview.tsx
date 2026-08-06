import { A4Page } from "@/components/templates/primitives/A4Page"
import { ResumeSectionBlock } from "@/components/templates/primitives/ResumeSectionBlock"
import { SectionHeading } from "@/components/templates/primitives/SectionHeading"
import { ContactItem } from "@/components/templates/primitives/ContactItem"
import { resolveTokens } from "@/lib/templates/tokens"
import type { TemplateRenderProps } from "@/types/template"
import { Mail, Phone, Globe, MapPin } from "lucide-react"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"

const CHIP_REFS = new Set(["skills", "languages"])
const SIDEBAR_REFS = new Set(["skills", "languages", "certifications", "hobbies", "references"])

/** Chip Olive — earthy olive palette variant of the scannable chip skills sidebar layout. */
export function ChipOlivePreview({ data, sectionOrder, customization }: TemplateRenderProps) {
  const tokens = resolveTokens(customization)
  const { personal } = data
  const main = sectionOrder.filter((s) => s.ref !== "personal" && !SIDEBAR_REFS.has(s.ref))
  const sidebarRest = sectionOrder.filter((s) => SIDEBAR_REFS.has(s.ref) && !CHIP_REFS.has(s.ref))

  return (
    <A4Page tokens={tokens} className="flex flex-row overflow-hidden">
      <main
        className="flex flex-1 flex-col"
        style={{ padding: `${tokens.spacing.pageMargin}mm`, gap: tokens.spacing.section }}
      >
        <div>
          <h1 className="text-[var(--tpl-size-xxl)] font-bold" style={{ color: tokens.primary }}>
            {personal.fullName || "Your Name"}
          </h1>
          {personal.role && (
            <p className="mt-0.5 text-[var(--tpl-size-lg)] font-medium" style={{ color: tokens.accent }}>
              {personal.role}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[var(--tpl-size-xs)] text-[var(--tpl-muted)]">
            <ContactItem icon={Mail} iconStyle={tokens.iconStyle}>{personal.email}</ContactItem>
            <ContactItem icon={Phone} iconStyle={tokens.iconStyle}>{personal.phone}</ContactItem>
            <ContactItem icon={MapPin} iconStyle={tokens.iconStyle}>{personal.address}</ContactItem>
            <ContactItem icon={Globe} iconStyle={tokens.iconStyle}>{personal.portfolio}</ContactItem>
            <ContactItem icon={LinkedinIcon} iconStyle={tokens.iconStyle}>{personal.linkedin}</ContactItem>
            <ContactItem icon={GithubIcon} iconStyle={tokens.iconStyle}>{personal.github}</ContactItem>
          </div>
        </div>

        {main.map((meta) => (
          <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} />
        ))}
      </main>

      <aside
        className="flex w-[35%] shrink-0 flex-col"
        style={{
          backgroundColor: tokens.surface,
          padding: `${tokens.spacing.pageMargin}mm ${tokens.spacing.pageMargin * 0.7}mm`,
          gap: tokens.spacing.section,
        }}
      >
        {data.skills.length > 0 && (
          <div>
            <SectionHeading headingStyle={tokens.headingStyle} className="mb-2">
              Skills
            </SectionHeading>
            <div className="flex flex-col gap-2">
              {data.skills.map((group) => (
                <div key={group.id}>
                  <p className="mb-1 text-[var(--tpl-size-xs)] font-semibold text-[var(--tpl-muted)]">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full px-2.5 py-1 text-[var(--tpl-size-xs)]"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${tokens.accent}, white 82%)`,
                          color: tokens.primary,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div>
            <SectionHeading headingStyle={tokens.headingStyle} className="mb-2">
              Languages
            </SectionHeading>
            <div className="flex flex-wrap gap-1.5">
              {data.languages.map((lang) => (
                <span
                  key={lang.id}
                  className="rounded-full px-2.5 py-1 text-[var(--tpl-size-xs)]"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${tokens.accent}, white 82%)`,
                    color: tokens.primary,
                  }}
                >
                  {lang.name} · {lang.proficiency}
                </span>
              ))}
            </div>
          </div>
        )}

        {sidebarRest.map((meta) => (
          <ResumeSectionBlock key={meta.ref} meta={meta} data={data} tokens={tokens} dense />
        ))}
      </aside>
    </A4Page>
  )
}
