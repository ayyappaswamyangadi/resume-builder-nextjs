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

function getErrorCode(err: unknown): string | undefined {
  return (err as { code?: string }).code
}

function googleSignInErrorMessage(err: unknown): string {
  switch (getErrorCode(err)) {
    case "auth/unauthorized-domain":
      return `Google sign-in isn't enabled for ${window.location.hostname}. Add it under Firebase Authentication → Settings → Authorized domains.`
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Allow popups for this site and try again."
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "The sign-in popup was closed before finishing. Please try again."
    case "auth/network-request-failed":
      return "Network error while contacting Google. Check your connection and try again."
    case "auth/web-storage-unsupported":
      return "Your browser is blocking the storage sign-in needs. Disable private browsing or allow site data and try again."
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled for this app."
    case "auth/user-disabled":
      return "This account has been disabled."
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email. Sign in with your email and password instead."
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again."
    default:
      return "Google sign-in failed. Please try again."
  }
}

function emailSignInErrorMessage(err: unknown): string {
  switch (getErrorCode(err)) {
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password."
    case "auth/invalid-email":
      return "That email address is not valid."
    case "auth/user-disabled":
      return "This account has been disabled."
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again."
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again."
    default:
      return "Could not sign in. Please try again."
  }
}

function signUpErrorMessage(err: unknown): string {
  switch (getErrorCode(err)) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead."
    case "auth/invalid-email":
      return "That email address is not valid."
    case "auth/weak-password":
      return "Choose a stronger password (at least 6 characters)."
    case "auth/operation-not-allowed":
      return "Email sign-up is not enabled for this app."
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again."
    default:
      return "Could not create an account with those details."
  }
}

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
    } catch (err) {
      console.error("Google sign-in failed", err)
      set({ error: googleSignInErrorMessage(err) })
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
    } catch (err) {
      set({ error: emailSignInErrorMessage(err) })
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
    } catch (err) {
      set({ error: signUpErrorMessage(err) })
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
      const code = getErrorCode(err)
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
