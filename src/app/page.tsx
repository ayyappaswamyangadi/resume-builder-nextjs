"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { ArrowRight, CheckCircle2, Download, FileText, LayoutTemplate, Palette, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { useAuthStore } from "@/store/authStore"

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: "50 designer templates",
    description: "ATS-friendly to creative — pick a layout for any role, from fresher to executive.",
  },
  {
    icon: Palette,
    title: "Deep customization",
    description: "Colors, fonts, spacing, margins, headings, and icons — make every template your own.",
  },
  {
    icon: Sparkles,
    title: "AI writing assist",
    description: "Improve your summary, rewrite bullet points, and generate skills in one click.",
  },
  {
    icon: Download,
    title: "Pixel-perfect PDF export",
    description: "A4-ready, high-resolution, selectable text — exactly what you see in the preview.",
  },
  {
    icon: FileText,
    title: "Every section you need",
    description: "Experience, projects, publications, volunteering, custom sections — fully reorderable.",
  },
]

export default function LandingPage() {
  const router = useRouter()
  const status = useAuthStore((s) => s.status)

  React.useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard")
  }, [status, router])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <FileText className="size-5" aria-hidden="true" />
            Resume Builder
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex" render={<Link href="/templates" />}>
              Templates
            </Button>
            <ThemeToggle />
            <Button variant="ghost" render={<Link href="/login" />}>
              Sign in
            </Button>
            <Button render={<Link href="/signup" />}>
              Get started <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-emerald-500" aria-hidden="true" />
              100% free — just sign up, no credit card, ever
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Build a resume that gets you hired.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance">
              A modern resume builder with live preview, 50 professionally designed templates, and
              pixel-perfect PDF export. No design skills required — and every feature is free once
              you sign up.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/signup" />}>
                Start building free <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/templates" />}>
                Browse templates
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="border-y bg-muted/30 py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Ready in minutes, not hours.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Pick a template, fill in your details, and export. Your progress autosaves to your
            account as you go, so you never lose a half-finished resume. Just sign up — every
            template, every feature, completely free.
          </p>
          <Button size="lg" className="mt-8" render={<Link href="/signup" />}>
            Create your resume <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Resume Builder. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/templates" className="hover:text-foreground">
              Templates
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
