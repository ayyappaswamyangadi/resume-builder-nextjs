import type { CSSProperties } from "react"
import { getFontOption } from "@/constants/fonts"
import type { CustomizationConfig } from "@/types/resume"

export interface ResolvedTokens {
  primary: string
  accent: string
  text: string
  muted: string
  border: string
  surface: string
  fontFamilyCss: string
  fontFamilyPdfFolder: string
  /** Family name react-pdf's Font.register was called with — pass to PDF Text `fontFamily`. */
  fontFamilyLabel: string
  fontCategory: "sans" | "serif"
  size: {
    xs: number
    sm: number
    base: number
    lg: number
    xl: number
    xxl: number
  }
  spacing: {
    /** gap between top-level sections */
    section: number
    /** gap between repeated items within a section */
    item: number
    /** page margin, mm (used verbatim by the PDF page and as inches-equivalent padding on web) */
    pageMargin: number
  }
  radius: number
  headingStyle: CustomizationConfig["headingStyle"]
  iconStyle: CustomizationConfig["iconStyle"]
}

/**
 * Normalizes user customization into a concrete pixel/scale token set consumed
 * identically by the web preview (CSS vars) and the PDF StyleSheet factory, so
 * the two renderers never drift out of sync.
 */
export function resolveTokens(customization: CustomizationConfig): ResolvedTokens {
  const base = customization.fontSize
  const font = getFontOption(customization.fontFamily)

  return {
    primary: customization.primaryColor,
    accent: customization.accentColor,
    text: "#1f2937",
    muted: "#6b7280",
    border: "#e5e7eb",
    surface: "#f8fafc",
    fontFamilyCss: font.cssVar,
    fontFamilyPdfFolder: font.pdfFolder,
    fontFamilyLabel: font.label,
    fontCategory: font.category,
    size: {
      xs: +(base * 0.78).toFixed(1),
      sm: +(base * 0.9).toFixed(1),
      base,
      lg: +(base * 1.35).toFixed(1),
      xl: +(base * 1.7).toFixed(1),
      xxl: +(base * 2.4).toFixed(1),
    },
    spacing: {
      section: customization.sectionSpacing,
      item: +(customization.sectionSpacing * 0.55).toFixed(1),
      pageMargin: customization.pageMargin,
    },
    radius: customization.borderRadius,
    headingStyle: customization.headingStyle,
    iconStyle: customization.iconStyle,
  }
}

/** CSS custom properties applied to a template's web preview root element. */
export function tokensToCssVars(tokens: ResolvedTokens): CSSProperties {
  return {
    "--tpl-primary": tokens.primary,
    "--tpl-accent": tokens.accent,
    "--tpl-text": tokens.text,
    "--tpl-muted": tokens.muted,
    "--tpl-border": tokens.border,
    "--tpl-surface": tokens.surface,
    "--tpl-font": tokens.fontFamilyCss,
    "--tpl-size-xs": `${tokens.size.xs}pt`,
    "--tpl-size-sm": `${tokens.size.sm}pt`,
    "--tpl-size-base": `${tokens.size.base}pt`,
    "--tpl-size-lg": `${tokens.size.lg}pt`,
    "--tpl-size-xl": `${tokens.size.xl}pt`,
    "--tpl-size-xxl": `${tokens.size.xxl}pt`,
    "--tpl-gap-section": `${tokens.spacing.section}px`,
    "--tpl-gap-item": `${tokens.spacing.item}px`,
    "--tpl-page-margin": `${tokens.spacing.pageMargin}mm`,
    "--tpl-radius": `${tokens.radius}px`,
    fontFamily: tokens.fontFamilyCss,
  } as CSSProperties
}
