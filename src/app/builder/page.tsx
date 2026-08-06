"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { BuilderToolbar } from "@/components/builder/BuilderToolbar"
import { SectionsEditor } from "@/components/builder/SectionsEditor"
import { ScaledPagePreview } from "@/components/builder/ScaledPagePreview"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomizationPanel } from "@/components/customization/CustomizationPanel"
import { getTemplate } from "@/lib/templates/registry"
import { useResumeStore } from "@/store/resumeStore"

function BuilderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const resumeId = searchParams.get("resumeId")
  const { activeResume, loadResume, isResumeLoading } = useResumeStore()
  const [customizeOpen, setCustomizeOpen] = React.useState(false)
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit")

  React.useEffect(() => {
    if (resumeId) loadResume(resumeId)
  }, [resumeId, loadResume])

  React.useEffect(() => {
    if (!isResumeLoading && resumeId && activeResume === null) {
      const timeout = setTimeout(() => router.replace("/dashboard"), 50)
      return () => clearTimeout(timeout)
    }
  }, [isResumeLoading, resumeId, activeResume, router])

  if (!resumeId || !activeResume || activeResume.id !== resumeId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

  const template = getTemplate(activeResume.templateId)
  const Preview = template.PreviewComponent

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BuilderToolbar resume={activeResume} onOpenCustomize={() => setCustomizeOpen(true)} />

      <div className="border-b px-4 py-2 lg:hidden">
        <Tabs value={mobileView} onValueChange={(v) => setMobileView(v as "edit" | "preview")}>
          <TabsList className="w-full">
            <TabsTrigger value="edit" className="flex-1">
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-2">
        <div className={`min-h-0 overflow-y-auto p-4 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
          <SectionsEditor resume={activeResume} />
        </div>
        <div
          className={`min-h-0 overflow-y-auto bg-muted/40 p-4 lg:border-l ${mobileView === "edit" ? "hidden lg:block" : ""}`}
        >
          <ScaledPagePreview>
            <Preview
              data={activeResume.data}
              sectionOrder={activeResume.sectionOrder}
              customization={activeResume.customization}
              showPhoto={template.hasPhoto}
            />
          </ScaledPagePreview>
        </div>
      </div>

      <Sheet open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Customize</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <CustomizationPanel customization={activeResume.customization} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function BuilderPage() {
  return (
    <RequireAuth>
      <React.Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        }
      >
        <BuilderContent />
      </React.Suspense>
    </RequireAuth>
  )
}
