"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Check, CheckCircle2, Download, LayoutTemplate, Loader2, Palette, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTemplate } from "@/lib/templates/registry"
import { downloadResumePdf } from "@/lib/pdf/export"
import { useResumeStore } from "@/store/resumeStore"
import { AUTOSAVE_INTERVAL_OPTIONS, usePreferencesStore } from "@/store/preferencesStore"
import type { Resume } from "@/types/resume"

export function BuilderToolbar({ resume, onOpenCustomize }: { resume: Resume; onOpenCustomize: () => void }) {
  const rename = useResumeStore((s) => s.rename)
  const setStatus = useResumeStore((s) => s.setStatus)
  const isSaving = useResumeStore((s) => s.isSaving)
  const saveNow = useResumeStore((s) => s.saveNow)
  const autosaveEnabled = usePreferencesStore((s) => s.autosaveEnabled)
  const autosaveIntervalMs = usePreferencesStore((s) => s.autosaveIntervalMs)
  const setAutosaveEnabled = usePreferencesStore((s) => s.setAutosaveEnabled)
  const setAutosaveIntervalMs = usePreferencesStore((s) => s.setAutosaveIntervalMs)
  const [title, setTitle] = React.useState(resume.title)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [isSavingNow, setIsSavingNow] = React.useState(false)
  const [isRenaming, setIsRenaming] = React.useState(false)
  const [isTogglingStatus, setIsTogglingStatus] = React.useState(false)

  React.useEffect(() => setTitle(resume.title), [resume.title])

  async function handleRenameBlur() {
    const trimmed = title.trim()
    if (!trimmed || trimmed === resume.title) return
    setIsRenaming(true)
    try {
      await rename(resume.id, trimmed)
    } finally {
      setIsRenaming(false)
    }
  }

  async function handleToggleStatus() {
    setIsTogglingStatus(true)
    try {
      await setStatus(resume.id, resume.status === "complete" ? "draft" : "complete")
    } finally {
      setIsTogglingStatus(false)
    }
  }

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

  async function handleSaveNow() {
    setIsSavingNow(true)
    try {
      await saveNow()
    } finally {
      setIsSavingNow(false)
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
        onBlur={handleRenameBlur}
        disabled={isRenaming}
        className="h-8 w-28 min-w-0 border-none bg-transparent px-1 font-medium shadow-none focus-visible:bg-muted sm:w-48"
        aria-label="Resume title"
      />

      <Badge variant="outline" className="hidden sm:inline-flex">
        {template.name}
      </Badge>

      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={handleToggleStatus}
        disabled={isTogglingStatus}
      >
        {isTogglingStatus ? (
          <Loader2 className="size-3 animate-spin" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="size-3" aria-hidden="true" />
        )}
        {resume.status === "complete" ? "Complete" : "Draft"}
      </Button>

      {autosaveEnabled ? (
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
      ) : (
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={handleSaveNow} disabled={isSavingNow}>
          {isSavingNow ? (
            <Loader2 className="size-3 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="size-3" aria-hidden="true" />
          )}
          Save now
        </Button>
      )}

      <Popover>
        <PopoverTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Autosave settings" />}
        >
          <Settings2 className="size-4" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="autosave-toggle" className="text-sm font-medium">
              Autosave
            </Label>
            <Switch id="autosave-toggle" checked={autosaveEnabled} onCheckedChange={setAutosaveEnabled} />
          </div>
          <p className="text-xs text-muted-foreground">
            {autosaveEnabled
              ? "Changes save automatically while you edit."
              : "Autosave is off — use Save now to keep your changes."}
          </p>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="autosave-interval" className="text-sm">
              Save frequency
            </Label>
            <Select
              value={String(autosaveIntervalMs)}
              onValueChange={(value) => setAutosaveIntervalMs(Number(value))}
            >
              <SelectTrigger id="autosave-interval" size="sm" disabled={!autosaveEnabled}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUTOSAVE_INTERVAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

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
