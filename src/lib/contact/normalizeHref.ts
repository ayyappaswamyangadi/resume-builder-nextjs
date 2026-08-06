export type ContactLinkKind = "email" | "linkedin" | "github" | "portfolio" | "url"

const FIXED_LABELS: Partial<Record<ContactLinkKind, string>> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  portfolio: "Portfolio",
}

/** Turns a raw contact field value into a clickable href - adds "https://" for bare domains and "mailto:" for emails. */
export function normalizeContactHref(kind: ContactLinkKind, value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (kind === "email") {
    return trimmed.toLowerCase().startsWith("mailto:") ? trimmed : `mailto:${trimmed}`
  }
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/**
 * Display text for a contact link - raw addresses stay visible for email, but links show a
 * friendly label instead of the raw URL (so resumes never show "linkedin.com/in/..." or the
 * portfolio's raw domain). Known kinds get a fixed label; unrecognized "url" kinds fall back to
 * the domain name (e.g. "behance.net" -> "Behance").
 */
export function contactLinkLabel(kind: ContactLinkKind, value: string): string {
  if (kind === "email") return value
  const fixed = FIXED_LABELS[kind]
  if (fixed) return fixed
  const href = normalizeContactHref(kind, value)
  if (!href) return value
  try {
    const hostname = new URL(href).hostname.replace(/^www\./i, "").toLowerCase()
    const siteName = hostname.split(".")[0]
    return siteName.charAt(0).toUpperCase() + siteName.slice(1)
  } catch {
    return value
  }
}
