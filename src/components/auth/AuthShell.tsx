"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { FileText, Sparkles, LayoutTemplate, Download } from "lucide-react"

const HIGHLIGHTS = [
  { icon: LayoutTemplate, text: "10 professionally designed templates" },
  { icon: Sparkles, text: "AI-assisted writing hooks, ready to wire up" },
  { icon: Download, text: "Pixel-perfect, selectable-text PDF export" },
]

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />
        <Link href="/" className="relative z-10 flex items-center gap-2 text-lg font-semibold">
          <FileText className="size-6" aria-hidden="true" />
          Resume Builder
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 space-y-8"
        >
          <h1 className="text-4xl font-semibold leading-tight text-balance">
            Build a resume that gets you the interview.
          </h1>
          <ul className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-primary-foreground/90">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <p className="relative z-10 text-sm text-primary-foreground/70">
          Free forever in guest mode — no account required.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="space-y-1.5 text-center lg:text-left">
            <Link href="/" className="mb-4 flex items-center justify-center gap-2 text-lg font-semibold lg:hidden">
              <FileText className="size-5" aria-hidden="true" />
              Resume Builder
            </Link>
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          <div className="text-center text-sm text-muted-foreground">{footer}</div>
        </motion.div>
      </div>
    </div>
  )
}
