import type { Resume } from "@/types/resume"
import type { ResumeRepository } from "@/services/repository/types"

const STORAGE_KEY = "resume-builder:guest-resumes"

function readAll(): Record<string, Resume> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, Resume>) : {}
  } catch {
    return {}
  }
}

function writeAll(resumes: Record<string, Resume>) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

/** Guest-mode persistence: everything lives in localStorage, no network required. */
export class LocalResumeRepository implements ResumeRepository {
  async list(): Promise<Resume[]> {
    return Object.values(readAll()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  async get(id: string): Promise<Resume | null> {
    return readAll()[id] ?? null
  }

  async save(resume: Resume): Promise<void> {
    const all = readAll()
    all[resume.id] = resume
    writeAll(all)
  }

  async remove(id: string): Promise<void> {
    const all = readAll()
    delete all[id]
    writeAll(all)
  }

  /** Wipes all guest resumes after a successful migration into Firestore. */
  clear() {
    writeAll({})
  }
}
