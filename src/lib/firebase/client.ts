"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
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

/** True once real Firebase project credentials are provided via env vars. Guest mode works without this. */
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
  if (!authInstance) authInstance = getAuth(firebaseApp)
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
