import { LocalResumeRepository } from "@/services/repository/local-repository"
import { FirestoreResumeRepository } from "@/services/repository/firestore-repository"
import type { ResumeRepository } from "@/services/repository/types"

export { LocalResumeRepository, FirestoreResumeRepository }
export type { ResumeRepository }

export function createRepository(uid: string | null): ResumeRepository {
  return uid ? new FirestoreResumeRepository(uid) : new LocalResumeRepository()
}

/**
 * Copies every locally-stored guest resume into the signed-in user's Firestore
 * account. Called once right after a guest completes Google/email sign-in.
 * Existing cloud resumes are left untouched; local resumes are cleared only
 * after every write succeeds.
 */
export async function migrateGuestResumesToAccount(uid: string): Promise<number> {
  const local = new LocalResumeRepository()
  const guestResumes = await local.list()
  if (guestResumes.length === 0) return 0

  const cloud = new FirestoreResumeRepository(uid)
  for (const resume of guestResumes) {
    await cloud.save({ ...resume, ownerId: uid })
  }
  local.clear()
  return guestResumes.length
}
