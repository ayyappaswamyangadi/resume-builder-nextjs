"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/** True once real Firebase project credentials are provided via env vars. Sign-in requires this. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null
let storageInstance: FirebaseStorage | null = null

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)
  }
  return app
}

export function getFirebaseAuth(): Auth | null {
  if (!isFirebaseConfigured) return null
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  if (!authInstance) {
    try {
      // localStorage first: Firebase's IndexedDB persistence refuses writes while the page is
      // hidden, and Safari hides the opener during signInWithPopup, so the sign-in result can't
      // be saved ("Database is closing/hidden"). IndexedDB stays in the list so existing
      // sessions stored there are migrated to localStorage instead of being signed out.
      authInstance = initializeAuth(firebaseApp, {
        persistence: [browserLocalPersistence, indexedDBLocalPersistence, browserSessionPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      })
    } catch {
      // Already initialized (e.g. after a hot reload) — reuse the existing instance.
      authInstance = getAuth(firebaseApp)
    }
  }
  return authInstance
}

export function getFirestoreDb(): Firestore | null {
  if (!isFirebaseConfigured) return null
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  if (!dbInstance) dbInstance = getFirestore(firebaseApp)
  return dbInstance
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (!isFirebaseConfigured) return null
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  if (!storageInstance) storageInstance = getStorage(firebaseApp)
  return storageInstance
}

export const googleAuthProvider = new GoogleAuthProvider()
