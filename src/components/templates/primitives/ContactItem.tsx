import type { ComponentType } from "react"
import { Mail, Globe } from "lucide-react"
import { GithubIcon } from "@/components/shared/icons/GithubIcon"
import { LinkedinIcon } from "@/components/shared/icons/LinkedinIcon"
import { contactLinkLabel, normalizeContactHref, type ContactLinkKind } from "@/lib/contact/normalizeHref"
import type { IconStyle } from "@/types/resume"

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>

// Every template passes one of these icons per semantic contact field (verified across all
// templates that use this primitive), so link "kind" can be inferred here instead of requiring
// each of the ~33 call sites to also pass it explicitly.
function linkKindForIcon(Icon: IconComponent): ContactLinkKind | undefined {
  if (Icon === Mail) return "email"
  if (Icon === Globe) return "portfolio"
  if (Icon === LinkedinIcon) return "linkedin"
  if (Icon === GithubIcon) return "github"
  return undefined
}

export function ContactItem({
  icon: Icon,
  children,
  iconStyle,
  className = "",
}: {
  icon: IconComponent
  children: React.ReactNode
  iconStyle: IconStyle
  className?: string
}) {
  if (!children) return null
  const kind = linkKindForIcon(Icon)
  const href = kind && typeof children === "string" ? normalizeContactHref(kind, children) : undefined

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {iconStyle !== "none" && (
        <Icon className="size-[1em] shrink-0" strokeWidth={iconStyle === "filled" ? 2.5 : 1.75} />
      )}
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
          {kind ? contactLinkLabel(kind, children as string) : children}
        </a>
      ) : (
        <span className="truncate">{children}</span>
      )}
    </span>
  )
}
