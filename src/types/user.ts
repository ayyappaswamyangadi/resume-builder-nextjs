export type AuthMode = "google" | "email" | "guest"

export interface AppUser {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  isGuest: boolean
}
