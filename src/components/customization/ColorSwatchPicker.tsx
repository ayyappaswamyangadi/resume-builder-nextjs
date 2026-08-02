"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function ColorSwatchPicker({
  label,
  value,
  presets,
  onChange,
}: {
  label: string
  value: string
  presets: string[]
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "size-7 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110",
              value.toLowerCase() === color.toLowerCase() && "ring-2 ring-ring"
            )}
            style={{ backgroundColor: color }}
            aria-label={`Set ${label} to ${color}`}
            aria-pressed={value.toLowerCase() === color.toLowerCase()}
          />
        ))}
        <div className="relative size-7 overflow-hidden rounded-full ring-1 ring-border">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -left-1 -top-1 size-9 cursor-pointer border-none bg-transparent p-0"
            aria-label={`Custom ${label.toLowerCase()}`}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-24 px-2 text-xs"
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  )
}
