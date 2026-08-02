const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/** Formats a "YYYY-MM" month-input value as "Mon YYYY"; anything else passes through untouched. */
export function formatMonthYear(value: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value.trim())
  if (!match) return value
  const monthIndex = Number(match[2]) - 1
  const label = MONTH_LABELS[monthIndex]
  return label ? `${label} ${match[1]}` : value
}

export function formatDateRange(startDate: string, endDate: string, current?: boolean): string {
  const start = formatMonthYear(startDate)
  const end = current ? "Present" : formatMonthYear(endDate)
  if (!start && !end) return ""
  if (!end) return start
  if (!start) return end
  return `${start} – ${end}`
}
