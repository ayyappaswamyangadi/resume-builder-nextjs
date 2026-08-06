"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { AuthShell } from "@/components/auth/AuthShell"
import { GoogleIcon } from "@/components/shared/GoogleIcon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuthStore } from "@/store/authStore"
import { loginSchema, type LoginFormValues } from "@/lib/validation/auth"

export default function LoginPage() {
  const router = useRouter()
  const { status, error, signInWithGoogle, signInWithEmail, clearError } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = React.useState<"google" | "email" | null>(null)

  React.useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard")
  }, [status, router])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting("email")
    clearError()
    await signInWithEmail(values.email, values.password)
    setIsSubmitting(null)
  }

  async function handleGoogle() {
    setIsSubmitting("google")
    clearError()
    await signInWithGoogle()
    setIsSubmitting(null)
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to sync your resumes across devices."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogle}
          disabled={isSubmitting !== null}
        >
          {isSubmitting === "google" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <GoogleIcon className="size-4" />
          )}
          Continue with Google
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <Separator className="flex-1" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting !== null}>
            {isSubmitting === "email" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Sign in
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
