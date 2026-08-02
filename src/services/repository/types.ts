import type { Resume } from "@/types/resume"

export interface ResumeRepository {
  list(): Promise<Resume[]>
  get(id: string): Promise<Resume | null>
  save(resume: Resume): Promise<void>
  remove(id: string): Promise<void>
}
