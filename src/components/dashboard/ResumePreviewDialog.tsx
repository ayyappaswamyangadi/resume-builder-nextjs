"use client"

import * as React from "react"
import Link from "next/link"
import { Loader2, Download, Pencil } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getTemplate } from "@/lib/templates/registry"
import { downloadResumePdf } from "@/lib/pdf/export"
import type { Resume } from "@/types/resume"

export function ResumePreviewDialog({
  resume,
  open,
  onOpenChange,
}: {
  resume: Resume | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isDownloading, setIsDownloading] = React.useState(false)

  async function handleDownload() {
    if (!resume) return
    setIsDownloading(true)
    try {
      await downloadResumePdf(resume)
    } catch {
      toast.error("Couldn't generate the PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const template = resume ? getTemplate(resume.templateId) : null
  const Preview = template?.PreviewComponent

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full !max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle>{resume?.title ?? "Preview"}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto bg-muted/40 p-6">
          {resume && Preview ? (
            <Preview
              data={resume.data}
              sectionOrder={resume.sectionOrder}
              customization={resume.customization}
              showPhoto={template!.hasPhoto}
            />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
            </div>
          )}
        </div>
        <DialogFooter className="border-t p-4">
          <Button variant="outline" render={<Link href={resume ? `/builder?resumeId=${resume.id}` : "#"} />}>
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading || !resume}>
            {isDownloading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="size-4" aria-hidden="true" />
            )}
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
