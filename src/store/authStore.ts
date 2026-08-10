import { create } from "zustand"
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  reauthenticateWithPopup,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"
import { getFirebaseAuth, googleAuthProvider } from "@/lib/firebase/client"
import type { AppUser } from "@/types/user"

export type AuthStatus = "loading" | "authenticated" | "signed-out"

function toAppUser(firebaseUser: FirebaseUser): AppUser {
  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    providerIds: firebaseUser.providerData.map((provider) => provider.providerId),
  }
}

interface AuthState {
  user: AppUser | null
  status: AuthStatus
  error: string | null
  init: () => () => void
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  setPassword: (password: string) => Promise<boolean>
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
        set({ status: "authenticated", user: toAppUser(firebaseUser) })
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

  setPassword: async (password) => {
    const auth = getFirebaseAuth()
    const currentUser = auth?.currentUser
    if (!auth || !currentUser || !currentUser.email) {
      set({ error: "You need to be signed in with an email address to set a password." })
      return false
    }

    async function link() {
      const credential = EmailAuthProvider.credential(currentUser!.email!, password)
      await linkWithCredential(currentUser!, credential)
    }

    try {
      await link()
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === "auth/requires-recent-login") {
        try {
          await reauthenticateWithPopup(currentUser, googleAuthProvider)
          await link()
        } catch {
          set({ error: "Please sign in again with Google, then retry setting a password." })
          return false
        }
      } else if (code === "auth/provider-already-linked" || code === "auth/credential-already-in-use") {
        set({ error: "A password is already set for this account." })
        return false
      } else if (code === "auth/weak-password") {
        set({ error: "Choose a stronger password (at least 6 characters)." })
        return false
      } else {
        set({ error: "Could not set a password. Please try again." })
        return false
      }
    }

    set({ error: null, user: toAppUser(currentUser) })
    return true
  },

  signOutUser: async () => {
    const auth = getFirebaseAuth()
    if (auth) await firebaseSignOut(auth)
    set({ status: "signed-out", user: null })
  },

  clearError: () => set({ error: null }),
}))
