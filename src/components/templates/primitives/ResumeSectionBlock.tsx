import { SectionHeading } from "@/components/templates/primitives/SectionHeading"
import { Bullets } from "@/components/templates/primitives/Bullets"
import { RichTextView } from "@/components/templates/richtext/RichTextView"
import { formatDateRange, formatMonthYear } from "@/lib/format"
import type { ResolvedTokens } from "@/lib/templates/tokens"
import type { ResumeData, SectionMeta } from "@/types/resume"

/**
 * Renders one resume section's heading + content for a given section-order
 * entry. Shared by every template so section-type layout logic (how an
 * experience item vs. a certification renders) lives in exactly one place;
 * templates only differ in how they arrange the *columns/regions* these
 * blocks are placed into.
 */
export function ResumeSectionBlock({
  meta,
  data,
  tokens,
  dense = false,
}: {
  meta: SectionMeta
  data: ResumeData
  tokens: ResolvedTokens
  dense?: boolean
}) {
  if (!meta.visible) return null
  const gap = dense ? tokens.spacing.item * 0.7 : tokens.spacing.item

  const heading = (
    <SectionHeading headingStyle={tokens.headingStyle} className="mb-1.5">
      {meta.label}
    </SectionHeading>
  )

  const body = renderBody(meta, data)
  if (body === null) return null

  return (
    <section aria-label={meta.label}>
      {heading}
      <div style={{ display: "flex", flexDirection: "column", gap }}>{body}</div>
    </section>
  )
}

/** Lets templates that wrap each section in decorative chrome (cards, dividers) skip empty sections. */
export function sectionHasContent(meta: SectionMeta, data: ResumeData): boolean {
  return meta.visible && renderBody(meta, data) !== null
}

function renderBody(meta: SectionMeta, data: ResumeData) {
  const ref = meta.ref

  if (ref === "summary") return data.summary ? <RichTextView html={data.summary} /> : null
  if (ref === "objective") return data.objective ? <RichTextView html={data.objective} /> : null
  if (ref === "hobbies") {
    if (data.hobbies.length === 0) return null
    return <p>{data.hobbies.join(" · ")}</p>
  }

  if (ref === "experience") {
    if (data.experience.length === 0) return null
    return (
      <>
        {data.experience.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-semibold">
                {item.role}
                {item.company && <span className="font-normal"> · {item.company}</span>}
              </p>
              <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)] whitespace-nowrap">
                {formatDateRange(item.startDate, item.endDate, item.current)}
              </p>
            </div>
            {item.location && <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)]">{item.location}</p>}
            <Bullets items={item.bullets} className="mt-1" />
          </div>
        ))}
      </>
    )
  }

  if (ref === "education") {
    if (data.education.length === 0) return null
    return (
      <>
        {data.education.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-semibold">
                {item.degree}
                {item.field && <span className="font-normal"> in {item.field}</span>}
              </p>
              <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)] whitespace-nowrap">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
            </div>
            <p className="text-[var(--tpl-size-sm)]">
              {item.institution}
              {item.location && `, ${item.location}`}
              {item.grade && ` · ${item.grade}`}
            </p>
            {item.description && <RichTextView html={item.description} className="text-[var(--tpl-size-sm)]" />}
          </div>
        ))}
      </>
    )
  }

  if (ref === "projects") {
    if (data.projects.length === 0) return null
    return (
      <>
        {data.projects.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-semibold">{item.name}</p>
              <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)] whitespace-nowrap">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
            </div>
            {item.description && <RichTextView html={item.description} className="text-[var(--tpl-size-sm)]" />}
            {item.techStack.length > 0 && (
              <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)]">{item.techStack.join(" · ")}</p>
            )}
          </div>
        ))}
      </>
    )
  }

  if (ref === "skills") {
    if (data.skills.length === 0) return null
    return (
      <>
        {data.skills.map((group) => (
          <p key={group.id} className="text-[var(--tpl-size-sm)]">
            <span className="font-semibold">{group.category}: </span>
            {group.items.join(", ")}
          </p>
        ))}
      </>
    )
  }

  if (ref === "languages") {
    if (data.languages.length === 0) return null
    return (
      <p className="text-[var(--tpl-size-sm)]">
        {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(" · ")}
      </p>
    )
  }

  if (ref === "achievements") {
    if (data.achievements.length === 0) return null
    return (
      <>
        {data.achievements.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-semibold">{item.title}</p>
              <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)] whitespace-nowrap">
                {formatMonthYear(item.date)}
              </p>
            </div>
            {item.description && <RichTextView html={item.description} className="text-[var(--tpl-size-sm)]" />}
          </div>
        ))}
      </>
    )
  }

  if (ref === "certifications") {
    if (data.certifications.length === 0) return null
    return (
      <>
        {data.certifications.map((item) => (
          <div key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p>
              <span className="font-semibold">{item.name}</span>
              {item.issuer && <span> · {item.issuer}</span>}
            </p>
            <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)] whitespace-nowrap">
              {formatMonthYear(item.date)}
            </p>
          </div>
        ))}
      </>
    )
  }

  if (ref === "publications") {
    if (data.publications.length === 0) return null
    return (
      <>
        {data.publications.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-semibold">{item.title}</p>
              <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)] whitespace-nowrap">
                {formatMonthYear(item.date)}
              </p>
            </div>
            {item.publisher && <p className="text-[var(--tpl-size-sm)] text-[var(--tpl-muted)]">{item.publisher}</p>}
            {item.description && <RichTextView html={item.description} className="text-[var(--tpl-size-sm)]" />}
          </div>
        ))}
      </>
    )
  }

  if (ref === "internships") {
    if (data.internships.length === 0) return null
    return (
      <>
        {data.internships.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-semibold">
                {item.role} · {item.company}
              </p>
              <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)] whitespace-nowrap">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
            </div>
            {item.description && <RichTextView html={item.description} className="text-[var(--tpl-size-sm)]" />}
          </div>
        ))}
      </>
    )
  }

  if (ref === "volunteer") {
    if (data.volunteer.length === 0) return null
    return (
      <>
        {data.volunteer.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-semibold">
                {item.role} · {item.organization}
              </p>
              <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)] whitespace-nowrap">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
            </div>
            {item.description && <RichTextView html={item.description} className="text-[var(--tpl-size-sm)]" />}
          </div>
        ))}
      </>
    )
  }

  if (ref === "references") {
    if (data.references.length === 0) return null
    return (
      <>
        {data.references.map((item) => (
          <div key={item.id}>
            <p className="font-semibold">{item.name}</p>
            <p className="text-[var(--tpl-size-sm)] text-[var(--tpl-muted)]">
              {[item.relationship, item.company].filter(Boolean).join(" · ")}
            </p>
            <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)]">
              {[item.email, item.phone].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </>
    )
  }

  if (ref.startsWith("custom:")) {
    const id = ref.slice("custom:".length)
    const section = data.customSections.find((s) => s.id === id)
    if (!section || section.items.length === 0) return null
    return (
      <>
        {section.items.map((item) => (
          <div key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-semibold">{item.heading}</p>
              {item.date && (
                <p className="text-[var(--tpl-size-xs)] text-[var(--tpl-muted)] whitespace-nowrap">
                  {formatMonthYear(item.date)}
                </p>
              )}
            </div>
            {item.subheading && <p className="text-[var(--tpl-size-sm)] text-[var(--tpl-muted)]">{item.subheading}</p>}
            {item.description && <RichTextView html={item.description} className="text-[var(--tpl-size-sm)]" />}
          </div>
        ))}
      </>
    )
  }

  return null
}
