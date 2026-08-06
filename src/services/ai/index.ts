import { simulate } from "@/services/ai/client"
import { toPlainText } from "@/lib/richtext/plain-text"

export async function improveSummary(currentSummary: string, role: string): Promise<string> {
  return simulate(() => {
    const base = toPlainText(currentSummary).trim()
    const roleLabel = role.trim() || "professional"
    if (!base) {
      return `Results-driven ${roleLabel} with a track record of delivering measurable impact through collaboration, ownership, and continuous learning. Known for translating ambiguous problems into clear, high-quality outcomes.`
    }
    return `${base.replace(/\.$/, "")} — refined for clarity and impact, highlighting measurable outcomes and core strengths as a ${roleLabel}.`
  })
}

export async function generateCareerObjective(role: string): Promise<string> {
  return simulate(() => {
    const roleLabel = role.trim() || "the role"
    return `Motivated ${roleLabel} seeking to leverage strong problem-solving skills and hands-on experience to contribute to a forward-thinking team, while continuing to grow technically and professionally.`
  })
}

export async function rewriteExperienceBullets(bullets: string[], role: string, company: string): Promise<string[]> {
  return simulate(() => {
    const context = [role, company].filter(Boolean).join(" at ") || "this role"
    const source = bullets.map((b) => toPlainText(b).trim()).filter((b) => b.length > 0)
    if (source.length === 0) {
      return [
        `Led key initiatives as part of ${context}, driving measurable improvements in efficiency and quality.`,
        `Collaborated cross-functionally to deliver outcomes on time and within scope.`,
      ]
    }
    return source.map((bullet) =>
      /^(led|built|drove|improved|launched|created|managed|designed|delivered)/i.test(bullet)
        ? bullet
        : `Drove ${bullet.replace(/^\w/, (c) => c.toLowerCase())}`
    )
  })
}

export async function generateSkills(role: string): Promise<string[]> {
  return simulate(() => {
    const roleLabel = role.trim().toLowerCase()
    if (roleLabel.includes("design")) return ["Figma", "User Research", "Design Systems", "Prototyping", "Accessibility"]
    if (roleLabel.includes("data")) return ["Python", "SQL", "Data Visualization", "Statistics", "Machine Learning"]
    if (roleLabel.includes("product")) return ["Roadmapping", "Stakeholder Management", "Agile", "User Stories", "Analytics"]
    return ["Problem Solving", "Communication", "Team Collaboration", "Project Management", "Adaptability"]
  })
}

export async function generateProjectDescription(projectName: string, techStack: string[]): Promise<string> {
  return simulate(() => {
    const stack = techStack.filter(Boolean).join(", ")
    const name = projectName.trim() || "This project"
    return stack
      ? `${name} is a solution built with ${stack}, focused on solving a real user problem with a clean, maintainable architecture and measurable results.`
      : `${name} is a solution focused on solving a real user problem with a clean, maintainable architecture and measurable results.`
  })
}
