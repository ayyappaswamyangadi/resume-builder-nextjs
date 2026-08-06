"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ProfilePhoto } from "@/components/templates/primitives/ProfilePhoto"
import { personalDetailsSchema, type PersonalDetailsFormValues } from "@/lib/validation/resume"
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback"
import { useResumeStore } from "@/store/resumeStore"
import type { PersonalDetails } from "@/types/resume"

const FIELDS: { name: keyof PersonalDetailsFormValues; label: string; placeholder?: string; half?: boolean; multiline?: boolean }[] = [
  { name: "fullName", label: "Full name", half: true },
  { name: "role", label: "Professional role", placeholder: "e.g. Senior Software Engineer", half: true },
  { name: "email", label: "Email", half: true },
  { name: "phone", label: "Phone", half: true },
  { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/...", half: true },
  { name: "github", label: "GitHub", placeholder: "https://github.com/...", half: true },
  { name: "portfolio", label: "Portfolio", placeholder: "https://", half: true },
  { name: "address", label: "Address", placeholder: "Street, City, State, ZIP", multiline: true },
]

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function PersonalSection({ personal, showPhotoUpload }: { personal: PersonalDetails; showPhotoUpload: boolean }) {
  const setPersonal = useResumeStore((s) => s.setPersonal)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: personal,
    mode: "onBlur",
  })

  const debouncedSetPersonal = useDebouncedCallback(setPersonal, 250)

  React.useEffect(() => {
    const subscription = form.watch((values) => debouncedSetPersonal(values as Partial<PersonalDetails>))
    return () => subscription.unsubscribe()
  }, [form, debouncedSetPersonal])

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    setPersonal({ photoUrl: dataUrl })
  }

  return (
    <div className="space-y-4">
      {showPhotoUpload && (
        <div className="flex items-center gap-4">
          <ProfilePhoto photoUrl={personal.photoUrl} fullName={personal.fullName} size={64} />
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              aria-label="Upload profile photo"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" aria-hidden="true" />
              Upload photo
            </Button>
            {personal.photoUrl && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setPersonal({ photoUrl: "" })}>
                <X className="size-4" aria-hidden="true" />
                Remove
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map((field) => (
          <div key={field.name} className={field.half ? "" : "col-span-2"}>
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.multiline ? (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                rows={2}
                {...form.register(field.name)}
                className="mt-1.5"
              />
            ) : (
              <Input id={field.name} placeholder={field.placeholder} {...form.register(field.name)} className="mt-1.5" />
            )}
            {form.formState.errors[field.name] && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors[field.name]?.message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
