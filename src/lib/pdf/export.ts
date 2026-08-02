import type { Resume } from "@/types/resume"

/**
 * Renders a resume to a PDF blob and triggers a browser download.
 * Implementation lives in ./render (client-only, dynamically imported)
 * because @react-pdf/renderer cannot run during server/static prerendering.
 */
export async function downloadResumePdf(resume: Resume): Promise<void> {
  const { renderResumePdfBlob } = await import("@/lib/pdf/render")
  const blob = await renderResumePdfBlob(resume)
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${resume.title || "resume"}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
