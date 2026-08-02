import type { CSSProperties } from "react"
import { tokensToCssVars, type ResolvedTokens } from "@/lib/templates/tokens"

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

/**
 * Renders the template root at true A4 proportions (210x297mm) so the on-screen
 * preview and the PDF export always agree on layout, wrapping, and page breaks.
 */
export function A4Page({
  tokens,
  children,
  style,
  className = "",
}: {
  tokens: ResolvedTokens
  children: React.ReactNode
  style?: CSSProperties
  className?: string
}) {
  return (
    <div
      className={`mx-auto bg-white text-[var(--tpl-text)] shadow-xl ${className}`}
      style={{
        width: "100%",
        maxWidth: `${A4_WIDTH_MM}mm`,
        aspectRatio: `${A4_WIDTH_MM} / ${A4_HEIGHT_MM}`,
        fontSize: `${tokens.size.base}pt`,
        lineHeight: 1.45,
        color: tokens.text,
        ...tokensToCssVars(tokens),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
