import Link from "next/link"
import { Plus } from "lucide-react"

export function CreateResumeCard() {
  return (
    <Link
      href="/templates?pick=1"
      className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary focus-visible:outline-none"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Plus className="size-5" aria-hidden="true" />
      </span>
      <span className="font-medium">Create Resume</span>
    </Link>
  )
}
