import { createId } from "@/lib/id"
import { DEFAULT_SECTION_ORDER, SECTION_LABELS } from "@/constants/sections"
import type {
  CustomizationConfig,
  Resume,
  ResumeData,
  SectionMeta,
  TemplateId,
} from "@/types/resume"

export function createEmptyResumeData(): ResumeData {
  return {
    personal: {
      fullName: "",
      role: "",
      email: "",
      phone: "",
      website: "",
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

export function createDefaultSectionOrder(): SectionMeta[] {
  return DEFAULT_SECTION_ORDER.map((ref) => ({
    ref,
    label: SECTION_LABELS[ref],
    visible: true,
    collapsed: false,
  }))
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

export function createResume(templateId: TemplateId, title = "Untitled Resume", ownerId: string | null = null): Resume {
  const now = new Date().toISOString()
  return {
    id: createId(),
    ownerId,
    title,
    templateId,
    data: createEmptyResumeData(),
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
