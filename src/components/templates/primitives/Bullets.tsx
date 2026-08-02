export function Bullets({ items, className = "" }: { items: string[]; className?: string }) {
  const filtered = items.filter((line) => line.trim().length > 0)
  if (filtered.length === 0) return null
  return (
    <ul className={`list-disc space-y-0.5 pl-4 marker:text-[var(--tpl-muted)] ${className}`}>
      {filtered.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  )
}
