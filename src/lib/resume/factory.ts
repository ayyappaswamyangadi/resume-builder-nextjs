import { createId } from "@/lib/id"
import { createDefaultSectionOrder } from "@/constants/sections"
import { SAMPLE_RESUME_DATA } from "@/constants/sample-resume"
import type {
  CustomizationConfig,
  Resume,
  ResumeData,
  TemplateId,
} from "@/types/resume"

export { createDefaultSectionOrder }

export function createEmptyResumeData(): ResumeData {
  return {
    personal: {
      fullName: "",
      role: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      portfolio: "",
      address: "",
      photoUrl: "",
    },
    summary: "",
    objective: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    achievements: [],
    certifications: [],
    publications: [],
    internships: [],
    volunteer: [],
    hobbies: [],
    references: [],
    customSections: [],
  }
}

export function createDefaultCustomization(): CustomizationConfig {
  return {
    primaryColor: "#1d4ed8",
    accentColor: "#0ea5e9",
    fontFamily: "inter",
    fontSize: 10,
    sectionSpacing: 14,
    pageMargin: 14,
    headingStyle: "uppercase",
    borderRadius: 8,
    iconStyle: "outline",
  }
}

/**
 * New resumes start pre-filled with sample content (rather than blank fields) so the builder
 * preview never opens empty - the user edits/replaces each field with their own info.
 */
export function createResume(templateId: TemplateId, title = "Untitled Resume", ownerId: string | null = null): Resume {
  const now = new Date().toISOString()
  return {
    id: createId(),
    ownerId,
    title,
    templateId,
    status: "draft",
    data: structuredClone(SAMPLE_RESUME_DATA),
    sectionOrder: createDefaultSectionOrder(),
    customization: createDefaultCustomization(),
    createdAt: now,
    updatedAt: now,
  }
}

export function duplicateResume(resume: Resume): Resume {
  const now = new Date().toISOString()
  return {
    ...resume,
    id: createId(),
    title: `${resume.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  }
}
