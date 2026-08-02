import type { CSSProperties } from "react"
import type { HeadingStyle } from "@/types/resume"

export function SectionHeading({
  children,
  headingStyle,
  color = "var(--tpl-primary)",
  className = "",
}: {
  children: React.ReactNode
  headingStyle: HeadingStyle
  color?: string
  className?: string
}) {
  const base = "font-semibold"
  const styleMap: Record<HeadingStyle, string> = {
    uppercase: "uppercase tracking-[0.08em] text-[var(--tpl-size-sm)]",
    bold: "text-[var(--tpl-size-lg)]",
    underline: "text-[var(--tpl-size-base)] pb-1 border-b-2",
    boxed: "text-[var(--tpl-size-sm)] uppercase tracking-wide px-2 py-1 rounded-[var(--tpl-radius)]",
    minimal: "text-[var(--tpl-size-sm)] uppercase tracking-widest font-medium",
  }

  const style: CSSProperties =
    headingStyle === "boxed"
      ? { backgroundColor: `color-mix(in oklch, ${color}, transparent 88%)`, color }
      : headingStyle === "underline"
        ? { borderColor: color, color }
        : { color }

  return (
    <h3 className={`${base} ${styleMap[headingStyle]} ${className}`} style={style}>
      {children}
    </h3>
  )
}
