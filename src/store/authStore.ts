import { create } from "zustand"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth"
import { getFirebaseAuth, googleAuthProvider } from "@/lib/firebase/client"
import type { AppUser } from "@/types/user"

export type AuthStatus = "loading" | "authenticated" | "signed-out"

interface AuthState {
  user: AppUser | null
  status: AuthStatus
  error: string | null
  init: () => () => void
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  signOutUser: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  error: null,

  init: () => {
    const auth = getFirebaseAuth()
    if (!auth) {
      set({ status: "signed-out", user: null })
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
          },
        })
        return
      }
      set({ status: "signed-out", user: null })
    })
    return unsubscribe
  },

  signInWithGoogle: async () => {
    const auth = getFirebaseAuth()
    if (!auth) {
      set({ error: "Firebase is not configured. Add your Firebase project keys to .env.local." })
      return
    }
    try {
      await signInWithPopup(auth, googleAuthProvider)
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
      set({ error: null })
    } catch {
      set({ error: "Could not create an account with those details." })
    }
  },

  signOutUser: async () => {
    const auth = getFirebaseAuth()
    if (auth) await firebaseSignOut(auth)
    set({ status: "signed-out", user: null })
  },

  clearError: () => set({ error: null }),
}))
