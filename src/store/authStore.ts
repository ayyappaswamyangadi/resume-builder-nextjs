import { create } from "zustand"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth"
import { getFirebaseAuth, googleAuthProvider, isFirebaseConfigured } from "@/lib/firebase/client"
import type { AppUser } from "@/types/user"

const GUEST_FLAG_KEY = "resume-builder:guest-mode"

export type AuthStatus = "loading" | "authenticated" | "guest" | "signed-out"

interface AuthState {
  user: AppUser | null
  status: AuthStatus
  error: string | null
  init: () => () => void
  continueAsGuest: () => void
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  signOutUser: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "loading",
  error: null,

  init: () => {
    if (!isFirebaseConfigured) {
      const wasGuest = typeof window !== "undefined" && window.localStorage.getItem(GUEST_FLAG_KEY) === "true"
      set(
        wasGuest
          ? { status: "guest", user: { uid: "guest", displayName: "Guest", email: null, photoURL: null, isGuest: true } }
          : { status: "signed-out", user: null }
      )
      return () => {}
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      set({ status: "signed-out" })
      return () => {}
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        set({
          status: "authenticated",
          user: {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            isGuest: false,
          },
        })
        return
      }
      const wasGuest = typeof window !== "undefined" && window.localStorage.getItem(GUEST_FLAG_KEY) === "true"
      set(
        wasGuest
          ? { status: "guest", user: { uid: "guest", displayName: "Guest", email: null, photoURL: null, isGuest: true } }
          : { status: "signed-out", user: null }
      )
    })
    return unsubscribe
  },

  continueAsGuest: () => {
    if (typeof window !== "undefined") window.localStorage.setItem(GUEST_FLAG_KEY, "true")
    set({
      status: "guest",
      user: { uid: "guest", displayName: "Guest", email: null, photoURL: null, isGuest: true },
      error: null,
    })
  },

  signInWithGoogle: async () => {
    const auth = getFirebaseAuth()
    if (!auth) {
      set({ error: "Firebase is not configured. Add your Firebase project keys to .env.local." })
      return
    }
    try {
      await signInWithPopup(auth, googleAuthProvider)
      if (typeof window !== "undefined") window.localStorage.removeItem(GUEST_FLAG_KEY)
      set({ error: null })
    } catch {
      set({ error: "Google sign-in failed. Please try again." })
    }
  },

  signInWithEmail: async (email, password) => {
    const auth = getFirebaseAuth()
    if (!auth) {
      set({ error: "Firebase is not configured. Add your Firebase project keys to .env.local." })
      return
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)
      if (typeof window !== "undefined") window.localStorage.removeItem(GUEST_FLAG_KEY)
      set({ error: null })
    } catch {
      set({ error: "Invalid email or password." })
    }
  },

  signUpWithEmail: async (email, password, displayName) => {
    const auth = getFirebaseAuth()
    if (!auth) {
      set({ error: "Firebase is not configured. Add your Firebase project keys to .env.local." })
      return
    }
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) await updateProfile(credential.user, { displayName })
      if (typeof window !== "undefined") window.localStorage.removeItem(GUEST_FLAG_KEY)
      set({ error: null })
    } catch {
      set({ error: "Could not create an account with those details." })
    }
  },

  signOutUser: async () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(GUEST_FLAG_KEY)
    const auth = getFirebaseAuth()
    if (auth && get().user && !get().user?.isGuest) {
      await firebaseSignOut(auth)
    }
    set({ status: "signed-out", user: null })
  },

  clearError: () => set({ error: null }),
}))
