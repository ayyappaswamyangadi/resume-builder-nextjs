import { createDefaultSectionOrder } from "@/constants/sections"
import type { ResumeData } from "@/types/resume"

/** Realistic placeholder content - used for gallery template previews and to seed new resumes. */
export const SAMPLE_RESUME_DATA: ResumeData = {
  personal: {
    fullName: "Ariana Cole",
    role: "Senior Product Designer",
    email: "ariana.cole@example.com",
    phone: "+1 (555) 012-3456",
    linkedin: "linkedin.com/in/arianacole",
    github: "github.com/arianacole",
    portfolio: "arianacole.design/work",
    address: "San Francisco, CA",
    photoUrl: "",
  },
  summary:
    "Product designer with 8+ years crafting user-centered experiences for B2B SaaS. Led design systems and cross-functional teams to ship products used by millions.",
  objective:
    "Seeking a senior design leadership role where I can mentor designers and drive product strategy end to end.",
  experience: [
    {
      id: "exp-1",
      company: "Northwind Labs",
      role: "Senior Product Designer",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "",
      current: true,
      bullets: [
        "Led redesign of core dashboard, increasing daily active usage by 34%",
        "Built and scaled a design system adopted across 6 product teams",
        "Mentored 4 junior designers through structured 1:1 growth plans",
      ],
    },
    {
      id: "exp-2",
      company: "Bright Path Inc.",
      role: "Product Designer",
      location: "Austin, TX",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      bullets: [
        "Designed onboarding flow that reduced drop-off by 22%",
        "Partnered with PM and engineering on quarterly roadmap planning",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Texas at Austin",
      degree: "B.F.A.",
      field: "Graphic Design",
      location: "Austin, TX",
      startDate: "2014-08",
      endDate: "2018-05",
      grade: "3.8 GPA",
      description: "",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Design System Toolkit",
      description: "An open-source Figma + React component toolkit adopted by 500+ teams.",
      techStack: ["Figma", "React", "Storybook"],
      link: "https://github.com/arianacole/toolkit",
      startDate: "2022-01",
      endDate: "2022-09",
    },
  ],
  skills: [
    { id: "skill-1", category: "Design", items: ["Figma", "Prototyping", "Design Systems", "User Research"] },
    { id: "skill-2", category: "Collaboration", items: ["Agile", "Stakeholder Management", "Storytelling"] },
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Native" },
    { id: "lang-2", name: "Spanish", proficiency: "Fluent" },
  ],
  achievements: [
    { id: "ach-1", title: "Design Leadership Award", description: "Recognized for cross-team design impact.", date: "2023-05" },
  ],
  certifications: [
    { id: "cert-1", name: "Certified UX Manager", issuer: "NN/g", date: "2022-11", credentialUrl: "" },
  ],
  publications: [],
  internships: [],
  volunteer: [
    {
      id: "vol-1",
      organization: "Design for Good",
      role: "Volunteer Designer",
      startDate: "2020-01",
      endDate: "",
      description: "Pro-bono design support for local nonprofits.",
    },
  ],
  hobbies: ["Photography", "Ceramics", "Trail running"],
  references: [],
  customSections: [],
}

export const SAMPLE_SECTION_ORDER = createDefaultSectionOrder()
