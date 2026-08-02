import type { ComponentType } from "react"
import type { IconStyle } from "@/types/resume"

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>

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
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {iconStyle !== "none" && (
        <Icon className="size-[1em] shrink-0" strokeWidth={iconStyle === "filled" ? 2.5 : 1.75} />
      )}
      <span className="truncate">{children}</span>
    </span>
  )
}
