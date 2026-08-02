import type { BuiltInSectionId } from "@/types/resume"

export const SECTION_LABELS: Record<BuiltInSectionId, string> = {
  personal: "Personal Details",
  summary: "Summary",
  objective: "Career Objective",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  languages: "Languages",
  achievements: "Achievements",
  certifications: "Certifications",
  publications: "Publications",
  internships: "Internships",
  volunteer: "Volunteer Work",
  hobbies: "Hobbies",
  references: "References",
}

/** Sections always pinned at the top of the form, excluded from drag reordering. */
export const PINNED_SECTIONS: BuiltInSectionId[] = ["personal"]

/** Sections that render as a single block (no repeatable items) and can't be "added to". */
export const SINGLE_VALUE_SECTIONS: BuiltInSectionId[] = ["summary", "objective", "hobbies"]

export const DEFAULT_SECTION_ORDER: BuiltInSectionId[] = [
  "personal",
  "summary",
  "objective",
  "experience",
  "education",
  "projects",
  "skills",
  "languages",
  "certifications",
  "achievements",
  "internships",
  "volunteer",
  "publications",
  "hobbies",
  "references",
]
