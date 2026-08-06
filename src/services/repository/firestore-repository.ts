import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { Resume } from "@/types/resume"
import type { ResumeRepository } from "@/services/repository/types"

const COLLECTION = "resumes"

/** Fills in `status` for documents written before the field existed. */
function normalize(resume: Resume): Resume {
  return resume.status ? resume : { ...resume, status: "draft" }
}

/** Logged-in persistence: Firestore, scoped to the signed-in user's uid. */
export class FirestoreResumeRepository implements ResumeRepository {
  constructor(private readonly uid: string) {}

  private requireDb() {
    const db = getFirestoreDb()
    if (!db) throw new Error("Firestore is not configured. Add Firebase env vars to enable cloud sync.")
    return db
  }

  async list(): Promise<Resume[]> {
    const db = this.requireDb()
    const q = query(collection(db, COLLECTION), where("ownerId", "==", this.uid))
    const snap = await getDocs(q)
    return snap.docs
      .map((d) => normalize(d.data() as Resume))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  async get(id: string): Promise<Resume | null> {
    const db = this.requireDb()
    const snap = await getDoc(doc(db, COLLECTION, id))
    if (!snap.exists()) return null
    const resume = normalize(snap.data() as Resume)
    return resume.ownerId === this.uid ? resume : null
  }

  async save(resume: Resume): Promise<void> {
    const db = this.requireDb()
    await setDoc(doc(db, COLLECTION, resume.id), { ...resume, ownerId: this.uid })
  }

  async remove(id: string): Promise<void> {
    const db = this.requireDb()
    await deleteDoc(doc(db, COLLECTION, id))
  }
}
