import type { ComponentType } from "react"
import type { CustomizationConfig, Resume, ResumeData, TemplateId } from "@/types/resume"

export type TemplateCategory =
  | "Freshers"
  | "Experienced"
  | "Executives"
  | "Software Engineers"
  | "Designers"
  | "Students"
  | "Corporate"
  | "Creative"
  | "Minimal"
  | "ATS Friendly"

export type TemplateBadge = "ats" | "popular" | "premium"

export interface TemplateRenderProps {
  data: ResumeData
  sectionOrder: Resume["sectionOrder"]
  customization: CustomizationConfig
  /** True when the template should render the profile photo (registry.hasPhoto templates only). */
  showPhoto: boolean
}

export interface TemplateDefinition {
  id: TemplateId
  name: string
  description: string
  categories: TemplateCategory[]
  hasPhoto: boolean
  badges: TemplateBadge[]
  defaultCustomization: CustomizationConfig
  /** Lazy-loaded web preview component. */
  PreviewComponent: ComponentType<TemplateRenderProps>
  /**
   * Loads the @react-pdf/renderer document component for this template. A plain
   * dynamic `import()` (not `next/dynamic`) — react-pdf's own reconciler renders
   * this element tree, and next/dynamic's React.lazy/Suspense wrapper isn't
   * guaranteed to work with a non-ReactDOM renderer. Only ever called from the
   * client-only PDF export path (src/lib/pdf/render.ts), never rendered directly.
   */
  loadPdfDocument: () => Promise<ComponentType<TemplateRenderProps>>
}
