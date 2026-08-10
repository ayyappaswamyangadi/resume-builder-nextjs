"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FileText, KeyRound, LayoutGrid, Loader2, LogOut, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { SetPasswordDialog } from "@/components/auth/SetPasswordDialog"
import { useAuthStore } from "@/store/authStore"

export function AppTopbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOutUser } = useAuthStore()
  const [isSigningOut, setIsSigningOut] = React.useState(false)
  const [setPasswordOpen, setSetPasswordOpen] = React.useState(false)
  const hasPassword = user?.providerIds.includes("password") ?? true

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)
    try {
      await signOutUser()
      router.replace("/login")
    } catch {
      setIsSigningOut(false)
    }
  }

  const initials = (user?.displayName ?? user?.email ?? "U").slice(0, 1).toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <FileText className="size-5" aria-hidden="true" />
            <span className="hidden sm:inline">Resume Builder</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              size="sm"
              render={<Link href="/dashboard" />}
            >
              <LayoutGrid className="size-4" aria-hidden="true" />
              Dashboard
            </Button>
            <Button
              variant={pathname === "/templates" ? "secondary" : "ghost"}
              size="sm"
              render={<Link href="/templates" />}
            >
              <FileText className="size-4" aria-hidden="true" />
              Templates
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Account menu" />}>
              <Avatar className="size-7">
                <AvatarImage src={user?.photoURL ?? undefined} alt="" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="truncate">{user?.displayName ?? user?.email}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {!hasPassword && (
                <DropdownMenuItem onSelect={() => setSetPasswordOpen(true)}>
                  <KeyRound className="size-4" aria-hidden="true" />
                  Set password
                </DropdownMenuItem>
              )}
              <DropdownMenuItem render={<a href="mailto:ayyappaswamy50@gmail.com" />}>
                <Mail className="size-4" aria-hidden="true" />
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut} disabled={isSigningOut} variant="destructive">
                {isSigningOut ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <LogOut className="size-4" aria-hidden="true" />
                )}
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <SetPasswordDialog open={setPasswordOpen} onOpenChange={setSetPasswordOpen} />
    </header>
  )
}
