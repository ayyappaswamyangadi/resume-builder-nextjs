"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { useResumeStore } from "@/store/resumeStore"
import { migrateGuestResumesToAccount } from "@/services/repository"

/** Wires Firebase auth state to the active resume repository (local vs Firestore),
 * and migrates any guest (localStorage) resumes into the account on first sign-in. */
export function useAppBootstrap() {
  const status = useAuthStore((s) => s.status)
  const uid = useAuthStore((s) => s.user?.uid)

  useEffect(() => {
    const unsubscribe = useAuthStore.getState().init()
    return unsubscribe
  }, [])

  useEffect(() => {
    if (status === "loading") return

    if (status === "authenticated" && uid) {
      migrateGuestResumesToAccount(uid).then((migrated) => {
        useResumeStore.getState().setRepositoryForUser(uid)
        if (migrated > 0) {
          toast.success(`Synced ${migrated} local resume${migrated > 1 ? "s" : ""} to your account`)
        }
      })
      return
    }

    useResumeStore.getState().setRepositoryForUser(null)
  }, [status, uid])
}
