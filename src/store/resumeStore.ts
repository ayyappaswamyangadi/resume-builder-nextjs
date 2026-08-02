import { create } from "zustand"
import { produce } from "immer"
import { createRepository, type ResumeRepository } from "@/services/repository"
import { createDefaultSectionOrder, createResume, duplicateResume } from "@/lib/resume/factory"
import { createId } from "@/lib/id"
import { debounce } from "@/lib/debounce"
import type {
  CustomizationConfig,
  CustomSection,
  CustomSectionItem,
  Resume,
  ResumeData,
  ResumeSummary,
  SectionMeta,
  TemplateId,
} from "@/types/resume"

function toSummary(resume: Resume): ResumeSummary {
  return {
    id: resume.id,
    title: resume.title,
    templateId: resume.templateId,
    updatedAt: resume.updatedAt,
    createdAt: resume.createdAt,
    fullName: resume.data.personal.fullName,
    role: resume.data.personal.role,
  }
}

export type RepeatableKey = {
  [K in keyof ResumeData]: ResumeData[K] extends Array<infer Item>
    ? Item extends { id: string }
      ? K
      : never
    : never
}[keyof ResumeData]

interface ResumeState {
  repository: ResumeRepository
  resumes: ResumeSummary[]
  activeResume: Resume | null
  isLoading: boolean
  isSaving: boolean
  lastSavedAt: string | null

  setRepositoryForUser: (uid: string | null) => Promise<void>
  refreshList: () => Promise<void>
  loadResume: (id: string) => Promise<void>
  clearActive: () => void
  createNew: (templateId: TemplateId, title?: string) => Promise<Resume>
  duplicate: (id: string) => Promise<void>
  remove: (id: string) => Promise<void>
  rename: (id: string, title: string) => Promise<void>

  mutateActive: (recipe: (draft: Resume) => void) => void
  setTemplate: (templateId: TemplateId) => void
  setCustomization: (patch: Partial<CustomizationConfig>) => void
  setPersonal: (patch: Partial<ResumeData["personal"]>) => void
  setSummary: (value: string) => void
  setObjective: (value: string) => void
  setHobbies: (value: string[]) => void

  reorderSections: (order: SectionMeta[]) => void
  toggleSectionVisibility: (ref: SectionMeta["ref"]) => void
  toggleSectionCollapsed: (ref: SectionMeta["ref"]) => void
  addCustomSection: (title: string) => void
  removeCustomSection: (id: string) => void
  renameCustomSection: (id: string, title: string) => void
  addCustomItem: (sectionId: string, item: CustomSectionItem) => void
  updateCustomItem: (sectionId: string, item: CustomSectionItem) => void
  removeCustomItem: (sectionId: string, itemId: string) => void
  reorderCustomItems: (sectionId: string, items: CustomSectionItem[]) => void

  addItem: <K extends RepeatableKey>(key: K, item: ResumeData[K][number]) => void
  updateItem: <K extends RepeatableKey>(key: K, id: string, patch: Partial<ResumeData[K][number]>) => void
  removeItem: <K extends RepeatableKey>(key: K, id: string) => void
  reorderItems: <K extends RepeatableKey>(key: K, items: ResumeData[K]) => void
}

const scheduleSave = debounce((get: () => ResumeState) => {
  const { activeResume, repository } = get()
  if (!activeResume) return
  useResumeStore.setState({ isSaving: true })
  repository
    .save(activeResume)
    .then(() => useResumeStore.setState({ isSaving: false, lastSavedAt: new Date().toISOString() }))
    .catch(() => useResumeStore.setState({ isSaving: false }))
}, 600)

export const useResumeStore = create<ResumeState>((set, get) => ({
  repository: createRepository(null),
  resumes: [],
  activeResume: null,
  isLoading: false,
  isSaving: false,
  lastSavedAt: null,

  setRepositoryForUser: async (uid) => {
    set({ repository: createRepository(uid), activeResume: null })
    await get().refreshList()
  },

  refreshList: async () => {
    set({ isLoading: true })
    try {
      const list = await get().repository.list()
      set({ resumes: list.map(toSummary), isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  loadResume: async (id) => {
    set({ isLoading: true })
    const resume = await get().repository.get(id)
    set({ activeResume: resume, isLoading: false })
  },

  clearActive: () => set({ activeResume: null }),

  createNew: async (templateId, title = "Untitled Resume") => {
    const resume = createResume(templateId, title)
    await get().repository.save(resume)
    await get().refreshList()
    return resume
  },

  duplicate: async (id) => {
    const existing = await get().repository.get(id)
    if (!existing) return
    await get().repository.save(duplicateResume(existing))
    await get().refreshList()
  },

  remove: async (id) => {
    await get().repository.remove(id)
    if (get().activeResume?.id === id) set({ activeResume: null })
    await get().refreshList()
  },

  rename: async (id, title) => {
    const existing = await get().repository.get(id)
    if (!existing) return
    const updated = { ...existing, title, updatedAt: new Date().toISOString() }
    await get().repository.save(updated)
    if (get().activeResume?.id === id) set({ activeResume: updated })
    await get().refreshList()
  },

  mutateActive: (recipe) => {
    const { activeResume } = get()
    if (!activeResume) return
    const next = produce(activeResume, (draft) => {
      recipe(draft)
      draft.updatedAt = new Date().toISOString()
    })
    set({ activeResume: next })
    scheduleSave(get)
  },

  setTemplate: (templateId) => get().mutateActive((draft) => void (draft.templateId = templateId)),

  setCustomization: (patch) =>
    get().mutateActive((draft) => void Object.assign(draft.customization, patch)),

  setPersonal: (patch) =>
    get().mutateActive((draft) => void Object.assign(draft.data.personal, patch)),

  setSummary: (value) => get().mutateActive((draft) => void (draft.data.summary = value)),
  setObjective: (value) => get().mutateActive((draft) => void (draft.data.objective = value)),
  setHobbies: (value) => get().mutateActive((draft) => void (draft.data.hobbies = value)),

  reorderSections: (order) => get().mutateActive((draft) => void (draft.sectionOrder = order)),

  toggleSectionVisibility: (ref) =>
    get().mutateActive((draft) => {
      const meta = draft.sectionOrder.find((s) => s.ref === ref)
      if (meta) meta.visible = !meta.visible
    }),

  toggleSectionCollapsed: (ref) =>
    get().mutateActive((draft) => {
      const meta = draft.sectionOrder.find((s) => s.ref === ref)
      if (meta) meta.collapsed = !meta.collapsed
    }),

  addCustomSection: (title) =>
    get().mutateActive((draft) => {
      const section: CustomSection = { id: createId(), title, items: [] }
      draft.data.customSections.push(section)
      draft.sectionOrder.push({ ref: `custom:${section.id}`, label: title, visible: true, collapsed: false })
    }),

  removeCustomSection: (id) =>
    get().mutateActive((draft) => {
      draft.data.customSections = draft.data.customSections.filter((s) => s.id !== id)
      draft.sectionOrder = draft.sectionOrder.filter((s) => s.ref !== `custom:${id}`)
    }),

  renameCustomSection: (id, title) =>
    get().mutateActive((draft) => {
      const section = draft.data.customSections.find((s) => s.id === id)
      if (section) section.title = title
      const meta = draft.sectionOrder.find((s) => s.ref === `custom:${id}`)
      if (meta) meta.label = title
    }),

  addCustomItem: (sectionId, item) =>
    get().mutateActive((draft) => {
      draft.data.customSections.find((s) => s.id === sectionId)?.items.push(item)
    }),

  updateCustomItem: (sectionId, item) =>
    get().mutateActive((draft) => {
      const section = draft.data.customSections.find((s) => s.id === sectionId)
      const found = section?.items.find((entry) => entry.id === item.id)
      if (found) Object.assign(found, item)
    }),

  removeCustomItem: (sectionId, itemId) =>
    get().mutateActive((draft) => {
      const section = draft.data.customSections.find((s) => s.id === sectionId)
      if (section) section.items = section.items.filter((entry) => entry.id !== itemId)
    }),

  reorderCustomItems: (sectionId, items) =>
    get().mutateActive((draft) => {
      const section = draft.data.customSections.find((s) => s.id === sectionId)
      if (section) section.items = items
    }),

  addItem: (key, item) =>
    get().mutateActive((draft) => {
      ;(draft.data[key] as Array<typeof item>).push(item)
    }),

  updateItem: (key, id, patch) =>
    get().mutateActive((draft) => {
      const list = draft.data[key] as Array<{ id: string }>
      const found = list.find((entry) => entry.id === id)
      if (found) Object.assign(found, patch)
    }),

  removeItem: (key, id) =>
    get().mutateActive((draft) => {
      const list = draft.data[key] as Array<{ id: string }>
      draft.data[key] = list.filter((entry) => entry.id !== id) as ResumeData[typeof key]
    }),

  reorderItems: (key, items) =>
    get().mutateActive((draft) => {
      draft.data[key] = items
    }),
}))

export { createDefaultSectionOrder }
