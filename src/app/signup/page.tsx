"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UserRound } from "lucide-react"
import { AuthShell } from "@/components/auth/AuthShell"
import { GoogleIcon } from "@/components/shared/GoogleIcon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuthStore } from "@/store/authStore"
import { signupSchema, type SignupFormValues } from "@/lib/validation/auth"

export default function SignupPage() {
  const router = useRouter()
  const { status, error, signInWithGoogle, signUpWithEmail, continueAsGuest, clearError } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = React.useState<"google" | "email" | "guest" | null>(null)

  React.useEffect(() => {
    if (status === "authenticated" || status === "guest") router.replace("/dashboard")
  }, [status, router])

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  async function onSubmit(values: SignupFormValues) {
    setIsSubmitting("email")
    clearError()
    await signUpWithEmail(values.email, values.password, values.name)
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
      title="Create your account"
      subtitle="Save resumes to the cloud and pick up where you left off, anywhere."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
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
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setIsSubmitting("guest")
            continueAsGuest()
          }}
          disabled={isSubmitting !== null}
        >
          <UserRound className="size-4" aria-hidden="true" />
          Continue as Guest
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or sign up with email</span>
        <Separator className="flex-1" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <Input type="password" autoComplete="new-password" placeholder="At least 6 characters" {...field} />
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
            Create account
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
