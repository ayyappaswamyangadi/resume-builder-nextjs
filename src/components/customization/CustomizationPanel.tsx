"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ColorSwatchPicker } from "@/components/customization/ColorSwatchPicker"
import { ACCENT_COLOR_PRESETS, PRIMARY_COLOR_PRESETS } from "@/constants/colors"
import { FONT_OPTIONS } from "@/constants/fonts"
import { useResumeStore } from "@/store/resumeStore"
import type { CustomizationConfig, HeadingStyle, IconStyle } from "@/types/resume"

const HEADING_STYLES: { value: HeadingStyle; label: string }[] = [
  { value: "uppercase", label: "Uppercase" },
  { value: "bold", label: "Bold" },
  { value: "underline", label: "Underline" },
  { value: "boxed", label: "Boxed" },
  { value: "minimal", label: "Minimal" },
]

const ICON_STYLES: { value: IconStyle; label: string }[] = [
  { value: "outline", label: "Outline" },
  { value: "filled", label: "Filled" },
  { value: "none", label: "No icons" },
]

export function CustomizationPanel({ customization }: { customization: CustomizationConfig }) {
  const setCustomization = useResumeStore((s) => s.setCustomization)

  return (
    <div className="space-y-6">
      <ColorSwatchPicker
        label="Primary color"
        value={customization.primaryColor}
        presets={PRIMARY_COLOR_PRESETS}
        onChange={(primaryColor) => setCustomization({ primaryColor })}
      />
      <ColorSwatchPicker
        label="Accent color"
        value={customization.accentColor}
        presets={ACCENT_COLOR_PRESETS}
        onChange={(accentColor) => setCustomization({ accentColor })}
      />

      <Separator />

      <div className="space-y-2">
        <Label>Font family</Label>
        <Select value={customization.fontFamily} onValueChange={(fontFamily) => setCustomization({ fontFamily: fontFamily as CustomizationConfig["fontFamily"] })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font.id} value={font.id}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Heading style</Label>
        <Select value={customization.headingStyle} onValueChange={(headingStyle) => setCustomization({ headingStyle: headingStyle as HeadingStyle })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HEADING_STYLES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Icon style</Label>
        <Select value={customization.iconStyle} onValueChange={(iconStyle) => setCustomization({ iconStyle: iconStyle as IconStyle })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ICON_STYLES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <SliderField
        label="Font size"
        value={customization.fontSize}
        min={8}
        max={13}
        step={0.5}
        unit="pt"
        onChange={(fontSize) => setCustomization({ fontSize })}
      />
      <SliderField
        label="Section spacing"
        value={customization.sectionSpacing}
        min={6}
        max={28}
        step={1}
        unit="px"
        onChange={(sectionSpacing) => setCustomization({ sectionSpacing })}
      />
      <SliderField
        label="Page margins"
        value={customization.pageMargin}
        min={8}
        max={25}
        step={1}
        unit="mm"
        onChange={(pageMargin) => setCustomization({ pageMargin })}
      />
      <SliderField
        label="Border radius"
        value={customization.borderRadius}
        min={0}
        max={20}
        step={1}
        unit="px"
        onChange={(borderRadius) => setCustomization({ borderRadius })}
      />

      <p className="text-xs text-muted-foreground">
        Reorder, hide, or show sections directly from the form panel — drag the grip handle on any section.
      </p>
    </div>
  )
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)} />
    </div>
  )
}
