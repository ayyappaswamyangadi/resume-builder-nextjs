import { NullResumeRepository } from "@/services/repository/null-repository"
import { FirestoreResumeRepository } from "@/services/repository/firestore-repository"
import type { ResumeRepository } from "@/services/repository/types"

export { NullResumeRepository, FirestoreResumeRepository }
export type { ResumeRepository }

export function createRepository(uid: string | null): ResumeRepository {
  return uid ? new FirestoreResumeRepository(uid) : new NullResumeRepository()
}
