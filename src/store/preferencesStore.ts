import { create } from "zustand"
import { persist } from "zustand/middleware"

export const AUTOSAVE_INTERVAL_OPTIONS = [
  { label: "Fast (0.5s)", value: 500 },
  { label: "Normal (1.5s)", value: 1500 },
  { label: "Slow (3s)", value: 3000 },
] as const

interface PreferencesState {
  autosaveEnabled: boolean
  autosaveIntervalMs: number
  setAutosaveEnabled: (enabled: boolean) => void
  setAutosaveIntervalMs: (intervalMs: number) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      autosaveEnabled: true,
      autosaveIntervalMs: 1500,
      setAutosaveEnabled: (autosaveEnabled) => set({ autosaveEnabled }),
      setAutosaveIntervalMs: (autosaveIntervalMs) => set({ autosaveIntervalMs }),
    }),
    { name: "resume-builder:preferences" }
  )
)
