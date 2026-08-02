import { Inter, Poppins, Roboto, Merriweather, Lato, Open_Sans, Montserrat } from "next/font/google"
import type { FontFamilyId } from "@/types/resume"

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600", "700"] })
export const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "500", "600", "700"] })
export const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto", weight: ["400", "500", "700"] })
export const merriweather = Merriweather({ subsets: ["latin"], variable: "--font-merriweather", weight: ["400", "700"] })
export const lato = Lato({ subsets: ["latin"], variable: "--font-lato", weight: ["400", "700"] })
export const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", weight: ["400", "600", "700"] })
export const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "500", "600", "700"] })

export const FONT_VARIABLE_CLASSNAMES = [
  inter.variable,
  poppins.variable,
  roboto.variable,
  merriweather.variable,
  lato.variable,
  openSans.variable,
  montserrat.variable,
].join(" ")

export interface FontOption {
  id: FontFamilyId
  label: string
  cssVar: string
  /** Folder name under /public/fonts holding self-hosted TTFs for @react-pdf/renderer. */
  pdfFolder: string
  category: "sans" | "serif"
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "inter", label: "Inter", cssVar: "var(--font-inter)", pdfFolder: "inter", category: "sans" },
  { id: "poppins", label: "Poppins", cssVar: "var(--font-poppins)", pdfFolder: "poppins", category: "sans" },
  { id: "roboto", label: "Roboto", cssVar: "var(--font-roboto)", pdfFolder: "roboto", category: "sans" },
  { id: "merriweather", label: "Merriweather", cssVar: "var(--font-merriweather)", pdfFolder: "merriweather", category: "serif" },
  { id: "lato", label: "Lato", cssVar: "var(--font-lato)", pdfFolder: "lato", category: "sans" },
  { id: "open-sans", label: "Open Sans", cssVar: "var(--font-open-sans)", pdfFolder: "open-sans", category: "sans" },
  { id: "montserrat", label: "Montserrat", cssVar: "var(--font-montserrat)", pdfFolder: "montserrat", category: "sans" },
]

export function getFontOption(id: FontFamilyId): FontOption {
  return FONT_OPTIONS.find((f) => f.id === id) ?? FONT_OPTIONS[0]
}
