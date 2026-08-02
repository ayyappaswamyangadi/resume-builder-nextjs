"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { useAppBootstrap } from "@/hooks/useAppBootstrap"

function Bootstrap() {
  useAppBootstrap()
  return null
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider delay={200}>
        <Bootstrap />
        {children}
        <Toaster richColors position="top-right" closeButton />
      </TooltipProvider>
    </ThemeProvider>
  )
}
