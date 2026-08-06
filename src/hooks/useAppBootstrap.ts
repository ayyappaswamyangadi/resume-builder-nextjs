"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { useResumeStore } from "@/store/resumeStore"

/** Wires Firebase auth state to the active resume repository. */
export function useAppBootstrap() {
  const status = useAuthStore((s) => s.status)
  const uid = useAuthStore((s) => s.user?.uid)

  useEffect(() => {
    const unsubscribe = useAuthStore.getState().init()
    return unsubscribe
  }, [])

  useEffect(() => {
    if (status === "loading") return
    useResumeStore.getState().setRepositoryForUser(status === "authenticated" && uid ? uid : null)
  }, [status, uid])
}
