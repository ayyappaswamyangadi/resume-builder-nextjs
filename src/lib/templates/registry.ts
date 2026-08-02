import dynamic from "next/dynamic"
import { createDefaultCustomization } from "@/lib/resume/factory"
import type { TemplateDefinition } from "@/types/template"
import type { TemplateId } from "@/types/resume"

function customization(overrides: Partial<ReturnType<typeof createDefaultCustomization>> = {}) {
  return { ...createDefaultCustomization(), ...overrides }
}

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateDefinition> = {
  "modern-ats": {
    id: "modern-ats",
    name: "Modern ATS",
    description: "Black & white, single column, built to sail through applicant tracking systems.",
    categories: ["ATS Friendly", "Freshers", "Corporate"],
    hasPhoto: false,
    badges: ["ats", "popular"],
    defaultCustomization: customization({ primaryColor: "#111827", accentColor: "#111827", headingStyle: "uppercase" }),
    PreviewComponent: dynamic(() => import("@/components/templates/modern-ats/Preview").then((m) => m.ModernAtsPreview)),
    loadPdfDocument: () => import("@/components/pdf/documents/ModernAtsDocument").then((m) => m.ModernAtsDocument),
  },
  "professional-blue": {
    id: "professional-blue",
    name: "Professional Blue",
    description: "Two-column sidebar layout with a bold blue rail for contact details and skills.",
    categories: ["Corporate", "Experienced"],
    hasPhoto: false,
    badges: ["popular"],
    defaultCustomization: customization({ primaryColor: "#1d4ed8", accentColor: "#1d4ed8" }),
    PreviewComponent: dynamic(() =>
      import("@/components/templates/professional-blue/Preview").then((m) => m.ProfessionalBluePreview)
    ),
    loadPdfDocument: () => import("@/components/pdf/documents/ProfessionalBlueDocument").then((m) => m.ProfessionalBlueDocument),
  },
  "minimal-elegant": {
    id: "minimal-elegant",
    name: "Minimal Elegant",
    description: "Quiet, whitespace-forward single column with a light touch of typographic elegance.",
    categories: ["Minimal", "Students"],
    hasPhoto: false,
    badges: ["ats"],
    defaultCustomization: customization({ primaryColor: "#334155", accentColor: "#64748b", headingStyle: "minimal" }),
    PreviewComponent: dynamic(() =>
      import("@/components/templates/minimal-elegant/Preview").then((m) => m.MinimalElegantPreview)
    ),
    loadPdfDocument: () => import("@/components/pdf/documents/MinimalElegantDocument").then((m) => m.MinimalElegantDocument),
  },
  "corporate-executive": {
    id: "corporate-executive",
    name: "Corporate Executive",
    description: "Formal photo header for senior and leadership roles, with a structured single column body.",
    categories: ["Executives", "Corporate"],
    hasPhoto: true,
    badges: [],
    defaultCustomization: customization({ primaryColor: "#1e3a5f", accentColor: "#b45309", headingStyle: "boxed" }),
    PreviewComponent: dynamic(() =>
      import("@/components/templates/corporate-executive/Preview").then((m) => m.CorporateExecutivePreview)
    ),
    loadPdfDocument: () => import("@/components/pdf/documents/CorporateExecutiveDocument").then((m) => m.CorporateExecutiveDocument),
  },
  "creative-designer": {
    id: "creative-designer",
    name: "Creative Designer",
    description: "Bold color-blocked header with photo and a vivid accent sidebar for design portfolios.",
    categories: ["Designers", "Creative"],
    hasPhoto: true,
    badges: ["popular"],
    defaultCustomization: customization({ primaryColor: "#7c3aed", accentColor: "#f59e0b" }),
    PreviewComponent: dynamic(() =>
      import("@/components/templates/creative-designer/Preview").then((m) => m.CreativeDesignerPreview)
    ),
    loadPdfDocument: () => import("@/components/pdf/documents/CreativeDesignerDocument").then((m) => m.CreativeDesignerDocument),
  },
  "material-style": {
    id: "material-style",
    name: "Material Style",
    description: "Elevated cards per section with Material-Design-inspired color and shadow.",
    categories: ["Software Engineers", "Designers"],
    hasPhoto: false,
    badges: [],
    defaultCustomization: customization({ primaryColor: "#0f766e", accentColor: "#0ea5e9", fontFamily: "roboto" }),
    PreviewComponent: dynamic(() =>
      import("@/components/templates/material-style/Preview").then((m) => m.MaterialStylePreview)
    ),
    loadPdfDocument: () => import("@/components/pdf/documents/MaterialStyleDocument").then((m) => m.MaterialStyleDocument),
  },
  "classic-resume": {
    id: "classic-resume",
    name: "Classic Resume",
    description: "Traditional centered header with full-width section rules — timeless and dependable.",
    categories: ["Corporate", "Experienced"],
    hasPhoto: false,
    badges: ["ats"],
    defaultCustomization: customization({ primaryColor: "#111827", accentColor: "#111827", fontFamily: "merriweather" }),
    PreviewComponent: dynamic(() =>
      import("@/components/templates/classic-resume/Preview").then((m) => m.ClassicResumePreview)
    ),
    loadPdfDocument: () => import("@/components/pdf/documents/ClassicResumeDocument").then((m) => m.ClassicResumeDocument),
  },
  "modern-green": {
    id: "modern-green",
    name: "Modern Green",
    description: "Clean single column with a fresh green accent rule under every heading.",
    categories: ["Software Engineers", "Freshers"],
    hasPhoto: false,
    badges: ["popular"],
    defaultCustomization: customization({ primaryColor: "#15803d", accentColor: "#15803d" }),
    PreviewComponent: dynamic(() => import("@/components/templates/modern-green/Preview").then((m) => m.ModernGreenPreview)),
    loadPdfDocument: () => import("@/components/pdf/documents/ModernGreenDocument").then((m) => m.ModernGreenDocument),
  },
  "elegant-purple": {
    id: "elegant-purple",
    name: "Elegant Purple",
    description: "Soft banner header with an airy two-column body split between story and specifics.",
    categories: ["Creative", "Students"],
    hasPhoto: false,
    badges: [],
    defaultCustomization: customization({ primaryColor: "#7c3aed", accentColor: "#a855f7" }),
    PreviewComponent: dynamic(() =>
      import("@/components/templates/elegant-purple/Preview").then((m) => m.ElegantPurplePreview)
    ),
    loadPdfDocument: () => import("@/components/pdf/documents/ElegantPurpleDocument").then((m) => m.ElegantPurpleDocument),
  },
  "premium-portfolio": {
    id: "premium-portfolio",
    name: "Premium Portfolio",
    description: "The flagship template: a refined dark sidebar with photo, dividers, and structured columns.",
    categories: ["Executives", "Designers"],
    hasPhoto: true,
    badges: ["premium", "popular"],
    defaultCustomization: customization({ primaryColor: "#111827", accentColor: "#d4a373", headingStyle: "underline" }),
    PreviewComponent: dynamic(() =>
      import("@/components/templates/premium-portfolio/Preview").then((m) => m.PremiumPortfolioPreview)
    ),
    loadPdfDocument: () => import("@/components/pdf/documents/PremiumPortfolioDocument").then((m) => m.PremiumPortfolioDocument),
  },
}

export const TEMPLATE_LIST = Object.values(TEMPLATE_REGISTRY)

export function getTemplate(id: TemplateId): TemplateDefinition {
  return TEMPLATE_REGISTRY[id]
}
