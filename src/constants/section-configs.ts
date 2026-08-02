import { createId } from "@/lib/id"
import { formatDateRange, formatMonthYear } from "@/lib/format"
import { generateProjectDescription, rewriteExperienceBullets } from "@/services/ai"
import {
  achievementItemSchema,
  certificationItemSchema,
  customSectionItemSchema,
  educationItemSchema,
  experienceItemSchema,
  internshipItemSchema,
  languageItemSchema,
  projectItemSchema,
  publicationItemSchema,
  referenceItemSchema,
  skillGroupSchema,
  volunteerItemSchema,
} from "@/lib/validation/resume"
import type { SectionConfig } from "@/types/section-config"
import type {
  AchievementItem,
  CertificationItem,
  CustomSectionItem,
  EducationItem,
  ExperienceItem,
  InternshipItem,
  LanguageItem,
  ProjectItem,
  PublicationItem,
  ReferenceItem,
  SkillGroup,
  VolunteerItem,
} from "@/types/resume"

export const experienceConfig: SectionConfig<ExperienceItem> = {
  title: "Experience",
  schema: experienceItemSchema,
  createEmpty: () => ({ id: createId(), company: "", role: "", location: "", startDate: "", endDate: "", current: false, bullets: [] }),
  fields: [
    { name: "role", label: "Job title", type: "text", half: true },
    { name: "company", label: "Company", type: "text", half: true },
    { name: "location", label: "Location", type: "text", half: true },
    { name: "startDate", label: "Start date", type: "month", half: true },
    { name: "endDate", label: "End date", type: "month", half: true },
    { name: "current", label: "I currently work here", type: "checkbox", half: true },
    {
      name: "bullets",
      label: "Highlights (one per line)",
      type: "list",
      ai: {
        label: "Rewrite with AI",
        run: (values) =>
          rewriteExperienceBullets(
            String(values.bullets ?? "").split("\n"),
            String(values.role ?? ""),
            String(values.company ?? "")
          ),
      },
    },
  ],
  summary: (item) => ({
    title: `${item.role || "Untitled role"}${item.company ? ` · ${item.company}` : ""}`,
    subtitle: item.location,
    meta: formatDateRange(item.startDate, item.endDate, item.current),
  }),
  emptyLabel: "No experience added yet",
}

export const educationConfig: SectionConfig<EducationItem> = {
  title: "Education",
  schema: educationItemSchema,
  createEmpty: () => ({ id: createId(), institution: "", degree: "", field: "", location: "", startDate: "", endDate: "", grade: "", description: "" }),
  fields: [
    { name: "degree", label: "Degree", type: "text", half: true },
    { name: "field", label: "Field of study", type: "text", half: true },
    { name: "institution", label: "Institution", type: "text", half: true },
    { name: "location", label: "Location", type: "text", half: true },
    { name: "startDate", label: "Start date", type: "month", half: true },
    { name: "endDate", label: "End date", type: "month", half: true },
    { name: "grade", label: "Grade / GPA", type: "text", half: true },
    { name: "description", label: "Description", type: "textarea" },
  ],
  summary: (item) => ({
    title: `${item.degree || "Untitled degree"}${item.field ? ` in ${item.field}` : ""}`,
    subtitle: item.institution,
    meta: formatDateRange(item.startDate, item.endDate),
  }),
  emptyLabel: "No education added yet",
}

export const projectsConfig: SectionConfig<ProjectItem> = {
  title: "Projects",
  schema: projectItemSchema,
  createEmpty: () => ({ id: createId(), name: "", description: "", techStack: [], link: "", startDate: "", endDate: "" }),
  fields: [
    { name: "name", label: "Project name", type: "text", half: true },
    { name: "link", label: "Link", type: "text", half: true, placeholder: "https://" },
    { name: "startDate", label: "Start date", type: "month", half: true },
    { name: "endDate", label: "End date", type: "month", half: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      ai: {
        label: "Generate with AI",
        run: (values) => generateProjectDescription(String(values.name ?? ""), String(values.techStack ?? "").split("\n")),
      },
    },
    { name: "techStack", label: "Tech stack (one per line)", type: "list" },
  ],
  summary: (item) => ({
    title: item.name || "Untitled project",
    subtitle: item.techStack.join(", "),
    meta: formatDateRange(item.startDate, item.endDate),
  }),
  emptyLabel: "No projects added yet",
}

export const skillsConfig: SectionConfig<SkillGroup> = {
  title: "Skill group",
  schema: skillGroupSchema,
  createEmpty: () => ({ id: createId(), category: "", items: [] }),
  fields: [
    { name: "category", label: "Category", type: "text", placeholder: "e.g. Programming Languages" },
    { name: "items", label: "Skills (one per line)", type: "list" },
  ],
  summary: (item) => ({ title: item.category || "Untitled group", subtitle: item.items.join(", ") }),
  emptyLabel: "No skills added yet",
}

export const languagesConfig: SectionConfig<LanguageItem> = {
  title: "Language",
  schema: languageItemSchema,
  createEmpty: () => ({ id: createId(), name: "", proficiency: "Fluent" }),
  fields: [
    { name: "name", label: "Language", type: "text", half: true },
    {
      name: "proficiency",
      label: "Proficiency",
      type: "select",
      half: true,
      options: [
        { value: "Basic", label: "Basic" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Fluent", label: "Fluent" },
        { value: "Native", label: "Native" },
      ],
    },
  ],
  summary: (item) => ({ title: item.name || "Untitled language", subtitle: item.proficiency }),
  emptyLabel: "No languages added yet",
}

export const achievementsConfig: SectionConfig<AchievementItem> = {
  title: "Achievement",
  schema: achievementItemSchema,
  createEmpty: () => ({ id: createId(), title: "", description: "", date: "" }),
  fields: [
    { name: "title", label: "Title", type: "text", half: true },
    { name: "date", label: "Date", type: "month", half: true },
    { name: "description", label: "Description", type: "textarea" },
  ],
  summary: (item) => ({ title: item.title || "Untitled achievement", meta: formatMonthYear(item.date) }),
  emptyLabel: "No achievements added yet",
}

export const certificationsConfig: SectionConfig<CertificationItem> = {
  title: "Certification",
  schema: certificationItemSchema,
  createEmpty: () => ({ id: createId(), name: "", issuer: "", date: "", credentialUrl: "" }),
  fields: [
    { name: "name", label: "Certification", type: "text", half: true },
    { name: "issuer", label: "Issuing organization", type: "text", half: true },
    { name: "date", label: "Date", type: "month", half: true },
    { name: "credentialUrl", label: "Credential URL", type: "text", half: true, placeholder: "https://" },
  ],
  summary: (item) => ({ title: item.name || "Untitled certification", subtitle: item.issuer, meta: formatMonthYear(item.date) }),
  emptyLabel: "No certifications added yet",
}

export const publicationsConfig: SectionConfig<PublicationItem> = {
  title: "Publication",
  schema: publicationItemSchema,
  createEmpty: () => ({ id: createId(), title: "", publisher: "", date: "", url: "", description: "" }),
  fields: [
    { name: "title", label: "Title", type: "text", half: true },
    { name: "publisher", label: "Publisher", type: "text", half: true },
    { name: "date", label: "Date", type: "month", half: true },
    { name: "url", label: "URL", type: "text", half: true, placeholder: "https://" },
    { name: "description", label: "Description", type: "textarea" },
  ],
  summary: (item) => ({ title: item.title || "Untitled publication", subtitle: item.publisher, meta: formatMonthYear(item.date) }),
  emptyLabel: "No publications added yet",
}

export const internshipsConfig: SectionConfig<InternshipItem> = {
  title: "Internship",
  schema: internshipItemSchema,
  createEmpty: () => ({ id: createId(), company: "", role: "", startDate: "", endDate: "", description: "" }),
  fields: [
    { name: "role", label: "Role", type: "text", half: true },
    { name: "company", label: "Company", type: "text", half: true },
    { name: "startDate", label: "Start date", type: "month", half: true },
    { name: "endDate", label: "End date", type: "month", half: true },
    { name: "description", label: "Description", type: "textarea" },
  ],
  summary: (item) => ({
    title: `${item.role || "Untitled role"}${item.company ? ` · ${item.company}` : ""}`,
    meta: formatDateRange(item.startDate, item.endDate),
  }),
  emptyLabel: "No internships added yet",
}

export const volunteerConfig: SectionConfig<VolunteerItem> = {
  title: "Volunteer work",
  schema: volunteerItemSchema,
  createEmpty: () => ({ id: createId(), organization: "", role: "", startDate: "", endDate: "", description: "" }),
  fields: [
    { name: "role", label: "Role", type: "text", half: true },
    { name: "organization", label: "Organization", type: "text", half: true },
    { name: "startDate", label: "Start date", type: "month", half: true },
    { name: "endDate", label: "End date", type: "month", half: true },
    { name: "description", label: "Description", type: "textarea" },
  ],
  summary: (item) => ({
    title: `${item.role || "Untitled role"}${item.organization ? ` · ${item.organization}` : ""}`,
    meta: formatDateRange(item.startDate, item.endDate),
  }),
  emptyLabel: "No volunteer work added yet",
}

export const referencesConfig: SectionConfig<ReferenceItem> = {
  title: "Reference",
  schema: referenceItemSchema,
  createEmpty: () => ({ id: createId(), name: "", relationship: "", company: "", email: "", phone: "" }),
  fields: [
    { name: "name", label: "Name", type: "text", half: true },
    { name: "relationship", label: "Relationship", type: "text", half: true },
    { name: "company", label: "Company", type: "text", half: true },
    { name: "email", label: "Email", type: "text", half: true },
    { name: "phone", label: "Phone", type: "text", half: true },
  ],
  summary: (item) => ({ title: item.name || "Untitled reference", subtitle: [item.relationship, item.company].filter(Boolean).join(" · ") }),
  emptyLabel: "No references added yet",
}

export const customSectionItemConfig: SectionConfig<CustomSectionItem> = {
  title: "Entry",
  schema: customSectionItemSchema,
  createEmpty: () => ({ id: createId(), heading: "", subheading: "", date: "", description: "" }),
  fields: [
    { name: "heading", label: "Heading", type: "text", half: true },
    { name: "date", label: "Date", type: "month", half: true },
    { name: "subheading", label: "Subheading", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
  ],
  summary: (item) => ({ title: item.heading || "Untitled entry", subtitle: item.subheading, meta: formatMonthYear(item.date) }),
  emptyLabel: "No entries added yet",
}
