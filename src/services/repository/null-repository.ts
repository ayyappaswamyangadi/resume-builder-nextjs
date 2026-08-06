import type { Resume } from "@/types/resume"
import type { ResumeRepository } from "@/services/repository/types"

/** Harmless placeholder used before auth resolves or while signed out. Real pages are gated by RequireAuth. */
export class NullResumeRepository implements ResumeRepository {
  async list(): Promise<Resume[]> {
    return []
  }

  async get(): Promise<Resume | null> {
    return null
  }

  async save(): Promise<void> {}

  async remove(): Promise<void> {}
}
