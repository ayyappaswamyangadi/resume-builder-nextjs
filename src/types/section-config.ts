import type { ZodType } from "zod"

export type FieldType = "text" | "textarea" | "month" | "checkbox" | "list" | "select"

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  options?: { value: string; label: string }[]
  /** Renders at half width, two per row, for compact fields like dates/locations. */
  half?: boolean
  helpText?: string
  /** Optional AI-assist hook: receives the form's current raw values, returns the new field value. */
  ai?: { label: string; run: (values: Record<string, string | boolean>) => Promise<string | string[]> }
}

export interface SectionConfig<T extends { id: string }> {
  title: string
  schema: ZodType<T>
  createEmpty: () => T
  fields: FieldConfig[]
  summary: (item: T) => { title: string; subtitle?: string; meta?: string }
  emptyLabel: string
}
