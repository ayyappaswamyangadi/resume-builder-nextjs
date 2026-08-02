"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status)
  const router = useRouter()

  React.useEffect(() => {
    if (status === "signed-out") router.replace("/login")
  }, [status, router])

  if (status === "loading" || status === "signed-out") {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading your account…</span>
      </div>
    )
  }

  return <>{children}</>
}
