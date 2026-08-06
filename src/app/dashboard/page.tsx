"use client"

import * as React from "react"
import { AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { FileText } from "lucide-react"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { AppTopbar } from "@/components/layout/AppTopbar"
import { ResumeCard } from "@/components/dashboard/ResumeCard"
import { CreateResumeCard } from "@/components/dashboard/CreateResumeCard"
import { ResumePreviewDialog } from "@/components/dashboard/ResumePreviewDialog"
import { PromptDialog } from "@/components/shared/PromptDialog"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useResumeStore } from "@/store/resumeStore"
import { downloadResumePdf } from "@/lib/pdf/export"

export default function DashboardPage() {
  const {
    resumes,
    isLoading,
    isResumeLoading,
    refreshList,
    duplicate,
    remove,
    rename,
    setStatus,
    loadResume,
    activeResume,
  } = useResumeStore()

  const [renamingId, setRenamingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [previewingId, setPreviewingId] = React.useState<string | null>(null)
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    refreshList()
  }, [refreshList])

  const renamingResume = resumes.find((r) => r.id === renamingId)
  const deletingResume = resumes.find((r) => r.id === deletingId)

  async function handlePreview(id: string) {
    setPreviewingId(id)
    await loadResume(id)
  }

  function withPending(id: string, promise: Promise<unknown>) {
    setPendingId(id)
    promise.finally(() => setPendingId((current) => (current === id ? null : current)))
    return promise
  }

  async function handleDownload(id: string) {
    const resume = await useResumeStore.getState().repository.get(id)
    if (!resume) return
    toast.promise(downloadResumePdf(resume), {
      loading: "Preparing PDF…",
      success: "Downloaded",
      error: "Couldn't generate the PDF",
    })
  }

  return (
    <RequireAuth>
      <AppTopbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Resumes</h1>
            <p className="text-sm text-muted-foreground">
              {resumes.length} resume{resumes.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
            <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-medium">No resumes yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Create your first resume, pick a template, and watch the live preview update as you type.
            </p>
            <div className="w-64 pt-2">
              <CreateResumeCard />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <CreateResumeCard />
            <AnimatePresence mode="popLayout">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  isPreviewPending={previewingId === resume.id && isResumeLoading}
                  isBusy={pendingId === resume.id}
                  onPreview={() => handlePreview(resume.id)}
                  onDuplicate={() =>
                    toast.promise(withPending(resume.id, duplicate(resume.id)), {
                      loading: "Duplicating…",
                      success: "Resume duplicated",
                      error: "Couldn't duplicate the resume",
                    })
                  }
                  onRename={() => setRenamingId(resume.id)}
                  onDelete={() => setDeletingId(resume.id)}
                  onDownload={() => handleDownload(resume.id)}
                  onToggleStatus={() =>
                    toast.promise(
                      withPending(
                        resume.id,
                        setStatus(resume.id, resume.status === "complete" ? "draft" : "complete")
                      ),
                      {
                        loading: "Updating…",
                        success: resume.status === "complete" ? "Marked as draft" : "Marked as complete",
                        error: "Couldn't update the resume",
                      }
                    )
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <PromptDialog
        open={!!renamingId}
        onOpenChange={(open) => !open && setRenamingId(null)}
        title="Rename resume"
        label="Resume name"
        defaultValue={renamingResume?.title ?? ""}
        onConfirm={(value) =>
          renamingId &&
          toast.promise(withPending(renamingId, rename(renamingId, value)), {
            loading: "Renaming…",
            success: "Resume renamed",
            error: "Couldn't rename the resume",
          })
        }
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete this resume?"
        description={`"${deletingResume?.title}" will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deletingId) {
            toast.promise(withPending(deletingId, remove(deletingId)), {
              loading: "Deleting…",
              success: "Resume deleted",
              error: "Couldn't delete the resume",
            })
          }
        }}
      />

      <ResumePreviewDialog
        resume={previewingId ? activeResume : null}
        open={!!previewingId}
        onOpenChange={(open) => !open && setPreviewingId(null)}
      />
    </RequireAuth>
  )
}
