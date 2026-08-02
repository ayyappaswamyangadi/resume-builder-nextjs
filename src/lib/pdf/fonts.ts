import { Font } from "@react-pdf/renderer"
import { FONT_OPTIONS } from "@/constants/fonts"

let registered = false

/** Registers every self-hosted Google Font (public/fonts/<slug>/<weight>.ttf) with react-pdf, once. */
export function ensurePdfFontsRegistered() {
  if (registered) return
  registered = true

  for (const font of FONT_OPTIONS) {
    Font.register({
      family: font.label,
      fonts: [400, 500, 600, 700].map((weight) => ({
        src: `/fonts/${font.pdfFolder}/${weight}.ttf`,
        fontWeight: weight,
      })),
    })
  }

  // react-pdf hyphenates long words to fit narrow columns by default; resumes
  // read better without mid-word breaks in names, links, and tech-stack chips.
  Font.registerHyphenationCallback((word) => [word])
}
