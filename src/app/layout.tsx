import type { Metadata, Viewport } from "next"
import { FONT_VARIABLE_CLASSNAMES, inter } from "@/constants/fonts"
import { AppProviders } from "@/components/providers/AppProviders"
import "./globals.css"

export const metadata: Metadata = {
  title: "Resume Builder — Craft a resume that gets you hired",
  description:
    "Build a professional, ATS-friendly resume in minutes with live preview, 10 designer templates, and high-quality PDF export.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${FONT_VARIABLE_CLASSNAMES} ${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
