"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AppTopbar } from "@/components/layout/AppTopbar"
import { TemplateCard } from "@/components/gallery/TemplateCard"
import { TEMPLATE_LIST } from "@/lib/templates/registry"
import { useAuthStore } from "@/store/authStore"
import { useResumeStore } from "@/store/resumeStore"
import type { TemplateId } from "@/types/resume"

export default function TemplatesPage() {
  const router = useRouter()
  const status = useAuthStore((s) => s.status)
  const createNew = useResumeStore((s) => s.createNew)
  const [creatingId, setCreatingId] = React.useState<TemplateId | null>(null)

  async function handleSelect(templateId: TemplateId) {
    if (status === "signed-out" || status === "loading") {
      router.push("/signup")
      return
    }
    setCreatingId(templateId)
    try {
      const resume = await createNew(templateId)
      router.push(`/builder?resumeId=${resume.id}`)
    } catch {
      toast.error("Couldn't create the resume. Please try again.")
      setCreatingId(null)
    }
  }

  const isLoggedInLayout = status === "authenticated" || status === "guest"

  return (
    <div className="flex min-h-screen flex-col">
      {isLoggedInLayout && <AppTopbar />}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground">
            10 professionally designed templates — pick one to start building.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TEMPLATE_LIST.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => handleSelect(template.id)}
              isCreating={creatingId === template.id}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
