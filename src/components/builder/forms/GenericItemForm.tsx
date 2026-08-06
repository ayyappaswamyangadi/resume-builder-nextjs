"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { Loader2, Sparkles } from "lucide-react"
import { RichBulletListField } from "@/components/builder/forms/RichBulletListField"
import { RichTextEditor } from "@/components/builder/richtext/RichTextEditor"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { isRichTextEmpty } from "@/lib/richtext/plain-text"
import type { FieldConfig, SectionConfig } from "@/types/section-config"

type FormShape = Record<string, string | boolean | string[]>

function toFormShape(item: Record<string, unknown>, fields: FieldConfig[]): FormShape {
  const shape: FormShape = {}
  for (const f of fields) {
    const value = item[f.name]
    if (f.type === "list" && f.richList) shape[f.name] = Array.isArray(value) ? value : []
    else if (f.type === "list") shape[f.name] = Array.isArray(value) ? value.join("\n") : ""
    else if (f.type === "checkbox") shape[f.name] = Boolean(value)
    else shape[f.name] = typeof value === "string" ? value : ""
  }
  return shape
}

function fromFormShape<T extends { id: string }>(id: string, values: FormShape, fields: FieldConfig[]): T {
  const result: Record<string, unknown> = { id }
  for (const f of fields) {
    const raw = values[f.name]
    if (f.type === "list" && f.richList) {
      result[f.name] = Array.isArray(raw) ? raw.filter((html) => !isRichTextEmpty(html)) : []
    } else if (f.type === "list") {
      result[f.name] = typeof raw === "string" ? raw.split("\n").map((s) => s.trim()).filter(Boolean) : []
    } else if (f.type === "checkbox") {
      result[f.name] = Boolean(raw)
    } else {
      result[f.name] = raw ?? ""
    }
  }
  return result as T
}

export function GenericItemForm<T extends { id: string }>({
  config,
  defaultItem,
  onSubmit,
  onCancel,
}: {
  config: SectionConfig<T>
  defaultItem: T
  onSubmit: (item: T) => void
  onCancel: () => void
}) {
  const form = useForm<FormShape>({
    defaultValues: toFormShape(defaultItem as unknown as Record<string, unknown>, config.fields),
  })
  const [aiLoadingField, setAiLoadingField] = React.useState<string | null>(null)

  async function runAiAssist(field: FieldConfig) {
    if (!field.ai) return
    setAiLoadingField(field.name)
    try {
      const result = await field.ai.run(form.getValues())
      if (field.richList) {
        form.setValue(field.name, Array.isArray(result) ? result : [result], { shouldDirty: true })
      } else {
        form.setValue(field.name, Array.isArray(result) ? result.join("\n") : result, { shouldDirty: true })
      }
    } finally {
      setAiLoadingField(null)
    }
  }

  function handleSubmit(values: FormShape) {
    const item = fromFormShape<T>(defaultItem.id, values, config.fields)
    const result = config.schema.safeParse(item)
    if (!result.success) {
      form.setError("root", { message: result.error.issues[0]?.message ?? "Please check the highlighted fields." })
      return
    }
    onSubmit(result.data)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        {config.fields.map((field) => (
          <div key={field.name} className={field.type === "checkbox" || !field.half ? "col-span-2" : ""}>
            {field.type === "checkbox" ? (
              <Controller
                control={form.control}
                name={field.name}
                render={({ field: rhf }) => (
                  <div className="flex items-center gap-2">
                    <Switch checked={Boolean(rhf.value)} onCheckedChange={rhf.onChange} id={field.name} />
                    <Label htmlFor={field.name}>{field.label}</Label>
                  </div>
                )}
              />
            ) : field.type === "select" ? (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Controller
                  control={form.control}
                  name={field.name}
                  render={({ field: rhf }) => (
                    <Select value={String(rhf.value)} onValueChange={rhf.onChange}>
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ) : field.type === "textarea" ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.ai && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-xs text-primary"
                      disabled={aiLoadingField === field.name}
                      onClick={() => runAiAssist(field)}
                    >
                      {aiLoadingField === field.name ? (
                        <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                      ) : (
                        <Sparkles className="size-3" aria-hidden="true" />
                      )}
                      {field.ai.label}
                    </Button>
                  )}
                </div>
                <Controller
                  control={form.control}
                  name={field.name}
                  render={({ field: rhf }) => (
                    <RichTextEditor
                      value={String(rhf.value ?? "")}
                      onChange={rhf.onChange}
                      placeholder={field.placeholder}
                      minHeight={60}
                    />
                  )}
                />
              </div>
            ) : field.type === "list" ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.ai && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-xs text-primary"
                      disabled={aiLoadingField === field.name}
                      onClick={() => runAiAssist(field)}
                    >
                      {aiLoadingField === field.name ? (
                        <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                      ) : (
                        <Sparkles className="size-3" aria-hidden="true" />
                      )}
                      {field.ai.label}
                    </Button>
                  )}
                </div>
                {field.richList ? (
                  <Controller
                    control={form.control}
                    name={field.name}
                    render={({ field: rhf }) => (
                      <RichBulletListField
                        value={Array.isArray(rhf.value) ? rhf.value : []}
                        onChange={rhf.onChange}
                        placeholder={field.placeholder}
                      />
                    )}
                  />
                ) : (
                  <Textarea id={field.name} rows={4} placeholder={field.placeholder} {...form.register(field.name)} />
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type === "month" ? "month" : "text"}
                  placeholder={field.placeholder}
                  {...form.register(field.name)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {form.formState.errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
