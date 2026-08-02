"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FileText, LayoutGrid, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { useAuthStore } from "@/store/authStore"

export function AppTopbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOutUser } = useAuthStore()

  async function handleSignOut() {
    await signOutUser()
    router.replace("/login")
  }

  const initials = (user?.displayName ?? user?.email ?? "G").slice(0, 1).toUpperCase()

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
                <AvatarFallback>{user?.isGuest ? <User className="size-4" /> : initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                {user?.isGuest ? (
                  <>
                    Guest session
                    <Badge variant="secondary">Local only</Badge>
                  </>
                ) : (
                  <span className="truncate">{user?.displayName ?? user?.email}</span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user?.isGuest && (
                <DropdownMenuItem render={<Link href="/signup" />}>
                  Create an account to sync
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={handleSignOut} variant="destructive">
                <LogOut className="size-4" aria-hidden="true" />
                {user?.isGuest ? "Exit guest mode" : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
