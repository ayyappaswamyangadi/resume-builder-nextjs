import { createElement, type ReactElement } from "react"
import { pdf, type DocumentProps } from "@react-pdf/renderer"
import { getTemplate } from "@/lib/templates/registry"
import type { Resume } from "@/types/resume"

/** Client-only: builds the react-pdf document tree for a resume and returns a PDF blob. */
export async function renderResumePdfBlob(resume: Resume): Promise<Blob> {
  const template = getTemplate(resume.templateId)
  const PdfDocument = await template.loadPdfDocument()

  // PdfDocument's own render output is a <Document>, but its component props are
  // TemplateRenderProps rather than DocumentProps — react-pdf's `pdf()` typings
  // only accept the former, so this cast bridges a real (if narrow) typing gap.
  const element = createElement(PdfDocument, {
    data: resume.data,
    sectionOrder: resume.sectionOrder,
    customization: resume.customization,
    showPhoto: template.hasPhoto,
  }) as unknown as ReactElement<DocumentProps>

  return pdf(element).toBlob()
}
