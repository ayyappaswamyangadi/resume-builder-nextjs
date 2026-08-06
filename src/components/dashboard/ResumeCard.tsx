"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { motion } from "motion/react"
import { CheckCircle2, Copy, Download, Eye, Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getTemplate } from "@/lib/templates/registry"
import type { ResumeSummary } from "@/types/resume"

export function ResumeCard({
  resume,
  onPreview,
  onDuplicate,
  onRename,
  onDelete,
  onDownload,
  onToggleStatus,
  isPreviewPending = false,
  isBusy = false,
}: {
  resume: ResumeSummary
  onPreview: () => void
  onDuplicate: () => void
  onRename: () => void
  onDelete: () => void
  onDownload: () => void
  onToggleStatus: () => void
  isPreviewPending?: boolean
  isBusy?: boolean
}) {
  const template = getTemplate(resume.templateId)

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
      <Card className="group relative gap-0 overflow-hidden py-0">
        <div className="h-2" style={{ backgroundColor: template.defaultCustomization.primaryColor }} />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{resume.title}</h3>
              <p className="truncate text-sm text-muted-foreground">
                {resume.fullName || "No name yet"}
                {resume.role && ` · ${resume.role}`}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="Resume actions" disabled={isBusy} />}
              >
                {isBusy ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MoreVertical className="size-4" aria-hidden="true" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={onRename}>
                  <Pencil className="size-4" aria-hidden="true" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onDuplicate}>
                  <Copy className="size-4" aria-hidden="true" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onDownload}>
                  <Download className="size-4" aria-hidden="true" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onToggleStatus}>
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {resume.status === "complete" ? "Mark as draft" : "Mark as complete"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onDelete} variant="destructive">
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{template.name}</Badge>
            <Badge variant={resume.status === "complete" ? "default" : "secondary"}>
              {resume.status === "complete" ? "Complete" : "Draft"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
            </span>
          </div>

          <div className="mt-1 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onPreview}
              disabled={isPreviewPending}
              className="flex-1"
            >
              {isPreviewPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
              Preview
            </Button>
            <Button size="sm" render={<Link href={`/builder?resumeId=${resume.id}`} />} className="flex-1">
              <Pencil className="size-4" aria-hidden="true" />
              Edit
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
