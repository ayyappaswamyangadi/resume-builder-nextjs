/** Core resume data model shared by forms, live preview, and PDF export. */

export interface PersonalDetails {
  fullName: string
  role: string
  email: string
  phone: string
  website: string
  linkedin: string
  github: string
  portfolio: string
  address: string
  photoUrl: string
}

export interface ExperienceItem {
  id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  grade: string
  description: string
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  techStack: string[]
  link: string
  startDate: string
  endDate: string
}

export interface SkillGroup {
  id: string
  category: string
  items: string[]
}

export interface LanguageItem {
  id: string
  name: string
  proficiency: "Basic" | "Intermediate" | "Fluent" | "Native"
}

export interface AchievementItem {
  id: string
  title: string
  description: string
  date: string
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl: string
}

export interface PublicationItem {
  id: string
  title: string
  publisher: string
  date: string
  url: string
  description: string
}

export interface InternshipItem {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

export interface VolunteerItem {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string
}

export interface ReferenceItem {
  id: string
  name: string
  relationship: string
  company: string
  email: string
  phone: string
}

export interface CustomSectionItem {
  id: string
  heading: string
  subheading: string
  date: string
  description: string
}

export interface CustomSection {
  id: string
  title: string
  items: CustomSectionItem[]
}

export interface ResumeData {
  personal: PersonalDetails
  summary: string
  objective: string
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: ProjectItem[]
  skills: SkillGroup[]
  languages: LanguageItem[]
  achievements: AchievementItem[]
  certifications: CertificationItem[]
  publications: PublicationItem[]
  internships: InternshipItem[]
  volunteer: VolunteerItem[]
  hobbies: string[]
  references: ReferenceItem[]
  customSections: CustomSection[]
}

/** The fixed built-in section keys; custom sections are addressed by CustomSection.id instead. */
export const BUILT_IN_SECTION_IDS = [
  "personal",
  "summary",
  "objective",
  "experience",
  "education",
  "projects",
  "skills",
  "languages",
  "achievements",
  "certifications",
  "publications",
  "internships",
  "volunteer",
  "hobbies",
  "references",
] as const

export type BuiltInSectionId = (typeof BUILT_IN_SECTION_IDS)[number]

/** A custom section is referenced as `custom:<CustomSection.id>` in the ordering array. */
export type SectionRef = BuiltInSectionId | `custom:${string}`

export interface SectionMeta {
  ref: SectionRef
  label: string
  visible: boolean
  collapsed: boolean
}

export type HeadingStyle = "uppercase" | "bold" | "underline" | "boxed" | "minimal"
export type IconStyle = "outline" | "filled" | "none"

export type FontFamilyId =
  | "inter"
  | "poppins"
  | "roboto"
  | "merriweather"
  | "lato"
  | "open-sans"
  | "montserrat"

export interface CustomizationConfig {
  primaryColor: string
  accentColor: string
  fontFamily: FontFamilyId
  fontSize: number
  sectionSpacing: number
  pageMargin: number
  headingStyle: HeadingStyle
  borderRadius: number
  iconStyle: IconStyle
}

export type TemplateId =
  | "modern-ats"
  | "professional-blue"
  | "minimal-elegant"
  | "corporate-executive"
  | "creative-designer"
  | "material-style"
  | "classic-resume"
  | "modern-green"
  | "elegant-purple"
  | "premium-portfolio"

export interface Resume {
  id: string
  ownerId: string | null
  title: string
  templateId: TemplateId
  data: ResumeData
  sectionOrder: SectionMeta[]
  customization: CustomizationConfig
  createdAt: string
  updatedAt: string
}

export type ResumeSummary = Pick<
  Resume,
  "id" | "title" | "templateId" | "updatedAt" | "createdAt"
> & {
  fullName: string
  role: string
}
