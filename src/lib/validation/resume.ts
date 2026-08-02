import { z } from "zod"

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Enter a valid URL starting with http(s)://")

const optionalEmail = z
  .string()
  .trim()
  .refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address")

export const personalDetailsSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  role: z.string().trim().min(1, "Professional role is required"),
  email: optionalEmail,
  phone: z.string().trim(),
  website: optionalUrl,
  linkedin: optionalUrl,
  github: optionalUrl,
  portfolio: optionalUrl,
  address: z.string().trim(),
  photoUrl: z.string().trim(),
})

export const summarySchema = z.string().trim().max(2000)
export const objectiveSchema = z.string().trim().max(2000)

export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().trim().min(1, "Company is required"),
  role: z.string().trim().min(1, "Role is required"),
  location: z.string().trim(),
  startDate: z.string().trim(),
  endDate: z.string().trim(),
  current: z.boolean(),
  bullets: z.array(z.string()),
})

export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string().trim().min(1, "Institution is required"),
  degree: z.string().trim().min(1, "Degree is required"),
  field: z.string().trim(),
  location: z.string().trim(),
  startDate: z.string().trim(),
  endDate: z.string().trim(),
  grade: z.string().trim(),
  description: z.string().trim(),
})

export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Project name is required"),
  description: z.string().trim(),
  techStack: z.array(z.string()),
  link: optionalUrl,
  startDate: z.string().trim(),
  endDate: z.string().trim(),
})

export const skillGroupSchema = z.object({
  id: z.string(),
  category: z.string().trim().min(1, "Category is required"),
  items: z.array(z.string()),
})

export const languageItemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Language is required"),
  proficiency: z.enum(["Basic", "Intermediate", "Fluent", "Native"]),
})

export const achievementItemSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim(),
  date: z.string().trim(),
})

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Certification name is required"),
  issuer: z.string().trim(),
  date: z.string().trim(),
  credentialUrl: optionalUrl,
})

export const publicationItemSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Title is required"),
  publisher: z.string().trim(),
  date: z.string().trim(),
  url: optionalUrl,
  description: z.string().trim(),
})

export const internshipItemSchema = z.object({
  id: z.string(),
  company: z.string().trim().min(1, "Company is required"),
  role: z.string().trim().min(1, "Role is required"),
  startDate: z.string().trim(),
  endDate: z.string().trim(),
  description: z.string().trim(),
})

export const volunteerItemSchema = z.object({
  id: z.string(),
  organization: z.string().trim().min(1, "Organization is required"),
  role: z.string().trim().min(1, "Role is required"),
  startDate: z.string().trim(),
  endDate: z.string().trim(),
  description: z.string().trim(),
})

export const referenceItemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Name is required"),
  relationship: z.string().trim(),
  company: z.string().trim(),
  email: optionalEmail,
  phone: z.string().trim(),
})

export const customSectionItemSchema = z.object({
  id: z.string(),
  heading: z.string().trim().min(1, "Heading is required"),
  subheading: z.string().trim(),
  date: z.string().trim(),
  description: z.string().trim(),
})

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Section title is required"),
  items: z.array(customSectionItemSchema),
})

export const customizationConfigSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color"),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color"),
  fontFamily: z.enum(["inter", "poppins", "roboto", "merriweather", "lato", "open-sans", "montserrat"]),
  fontSize: z.number().min(8).max(14),
  sectionSpacing: z.number().min(4).max(32),
  pageMargin: z.number().min(6).max(30),
  headingStyle: z.enum(["uppercase", "bold", "underline", "boxed", "minimal"]),
  borderRadius: z.number().min(0).max(24),
  iconStyle: z.enum(["outline", "filled", "none"]),
})

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>
export type ExperienceItemFormValues = z.infer<typeof experienceItemSchema>
export type EducationItemFormValues = z.infer<typeof educationItemSchema>
export type ProjectItemFormValues = z.infer<typeof projectItemSchema>
export type SkillGroupFormValues = z.infer<typeof skillGroupSchema>
export type LanguageItemFormValues = z.infer<typeof languageItemSchema>
export type AchievementItemFormValues = z.infer<typeof achievementItemSchema>
export type CertificationItemFormValues = z.infer<typeof certificationItemSchema>
export type PublicationItemFormValues = z.infer<typeof publicationItemSchema>
export type InternshipItemFormValues = z.infer<typeof internshipItemSchema>
export type VolunteerItemFormValues = z.infer<typeof volunteerItemSchema>
export type ReferenceItemFormValues = z.infer<typeof referenceItemSchema>
export type CustomSectionItemFormValues = z.infer<typeof customSectionItemSchema>
