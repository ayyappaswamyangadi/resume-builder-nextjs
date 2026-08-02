"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Check, Download, LayoutTemplate, Loader2, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getTemplate } from "@/lib/templates/registry"
import { downloadResumePdf } from "@/lib/pdf/export"
import { useResumeStore } from "@/store/resumeStore"
import type { Resume } from "@/types/resume"

export function BuilderToolbar({ resume, onOpenCustomize }: { resume: Resume; onOpenCustomize: () => void }) {
  const rename = useResumeStore((s) => s.rename)
  const isSaving = useResumeStore((s) => s.isSaving)
  const [title, setTitle] = React.useState(resume.title)
  const [isDownloading, setIsDownloading] = React.useState(false)

  React.useEffect(() => setTitle(resume.title), [resume.title])

  async function handleDownload() {
    setIsDownloading(true)
    try {
      await downloadResumePdf(resume)
    } catch (err) {
      console.error("[pdf-export]", err)
      toast.error("Couldn't generate the PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const template = getTemplate(resume.templateId)

  return (
    <div className="flex flex-wrap items-center gap-2 border-b bg-background/80 px-3 py-2.5 backdrop-blur sm:gap-3 sm:px-4">
      <Button variant="ghost" size="icon-sm" render={<Link href="/dashboard" aria-label="Back to dashboard" />}>
        <ArrowLeft className="size-4" aria-hidden="true" />
      </Button>

      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => title.trim() && title !== resume.title && rename(resume.id, title.trim())}
        className="h-8 w-28 min-w-0 border-none bg-transparent px-1 font-medium shadow-none focus-visible:bg-muted sm:w-48"
        aria-label="Resume title"
      />

      <Badge variant="outline" className="hidden sm:inline-flex">
        {template.name}
      </Badge>

      <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
        {isSaving ? (
          <>
            <Loader2 className="size-3 animate-spin" aria-hidden="true" /> Saving…
          </>
        ) : (
          <>
            <Check className="size-3" aria-hidden="true" /> Saved
          </>
        )}
      </span>

      <div className="ml-auto flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/templates" aria-label="Change template" />}
        >
          <LayoutTemplate className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Change template</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenCustomize} aria-label="Customize">
          <Palette className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Customize</span>
        </Button>
        <Button size="sm" onClick={handleDownload} disabled={isDownloading} aria-label="Download PDF">
          {isDownloading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="size-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">Download PDF</span>
        </Button>
      </div>
    </div>
  )
}
