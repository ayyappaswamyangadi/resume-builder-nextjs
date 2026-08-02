import type { SVGProps } from "react"

export function LinkedinIcon({ className, strokeWidth = 1.75, ...props }: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M6.94 6.5a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88Z" />
      <path d="M4 9h4v11H4zM10 9h3.8v1.6h.05c.53-.95 1.82-1.95 3.75-1.95 4 0 4.75 2.4 4.75 5.55V20h-4v-5.1c0-1.2-.02-2.75-1.7-2.75-1.7 0-1.96 1.3-1.96 2.65V20h-3.99z" />
    </svg>
  )
}
