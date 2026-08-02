"use client"

import * as React from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionShell } from "@/components/builder/SectionShell"
import { RepeatableSection } from "@/components/builder/RepeatableSection"
import { PersonalSection } from "@/components/builder/sections/PersonalSection"
import { SingleTextSection } from "@/components/builder/sections/SingleTextSection"
import { HobbiesSection } from "@/components/builder/sections/HobbiesSection"
import { SkillsSection } from "@/components/builder/sections/SkillsSection"
import { CustomSectionEditor } from "@/components/builder/sections/CustomSectionEditor"
import { PromptDialog } from "@/components/shared/PromptDialog"
import {
  achievementsConfig,
  certificationsConfig,
  educationConfig,
  experienceConfig,
  internshipsConfig,
  languagesConfig,
  projectsConfig,
  publicationsConfig,
  referencesConfig,
  volunteerConfig,
} from "@/constants/section-configs"
import { useRepeatableActions } from "@/hooks/useRepeatableActions"
import { useResumeStore } from "@/store/resumeStore"
import { generateCareerObjective, improveSummary } from "@/services/ai"
import { getTemplate } from "@/lib/templates/registry"
import type { Resume, SectionMeta } from "@/types/resume"

export function SectionsEditor({ resume }: { resume: Resume }) {
  const reorderSections = useResumeStore((s) => s.reorderSections)
  const toggleSectionVisibility = useResumeStore((s) => s.toggleSectionVisibility)
  const toggleSectionCollapsed = useResumeStore((s) => s.toggleSectionCollapsed)
  const setSummary = useResumeStore((s) => s.setSummary)
  const setObjective = useResumeStore((s) => s.setObjective)
  const setHobbies = useResumeStore((s) => s.setHobbies)
  const addCustomSection = useResumeStore((s) => s.addCustomSection)
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection)

  const [addingSection, setAddingSection] = React.useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const experience = useRepeatableActions("experience")
  const education = useRepeatableActions("education")
  const projects = useRepeatableActions("projects")
  const languages = useRepeatableActions("languages")
  const achievements = useRepeatableActions("achievements")
  const certifications = useRepeatableActions("certifications")
  const publications = useRepeatableActions("publications")
  const internships = useRepeatableActions("internships")
  const volunteer = useRepeatableActions("volunteer")
  const references = useRepeatableActions("references")

  const personalMeta = resume.sectionOrder.find((s) => s.ref === "personal")
  const rest = resume.sectionOrder.filter((s) => s.ref !== "personal")
  const template = getTemplate(resume.templateId)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = rest.findIndex((s) => s.ref === active.id)
    const newIndex = rest.findIndex((s) => s.ref === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = arrayMove(rest, oldIndex, newIndex)
    reorderSections(personalMeta ? [personalMeta, ...reordered] : reordered)
  }

  function renderContent(meta: SectionMeta) {
    switch (meta.ref) {
      case "summary":
        return (
          <SingleTextSection
            value={resume.data.summary}
            onChange={setSummary}
            placeholder="A brief 2–3 sentence summary of your experience and strengths…"
            aiLabel="Improve with AI"
            onAiAssist={() => improveSummary(resume.data.summary, resume.data.personal.role)}
          />
        )
      case "objective":
        return (
          <SingleTextSection
            value={resume.data.objective}
            onChange={setObjective}
            placeholder="What you're looking for in your next role…"
            aiLabel="Generate with AI"
            onAiAssist={() => generateCareerObjective(resume.data.personal.role)}
          />
        )
      case "hobbies":
        return <HobbiesSection hobbies={resume.data.hobbies} onChange={setHobbies} />
      case "experience":
        return <RepeatableSection config={experienceConfig} items={resume.data.experience} {...experience} />
      case "education":
        return <RepeatableSection config={educationConfig} items={resume.data.education} {...education} />
      case "projects":
        return <RepeatableSection config={projectsConfig} items={resume.data.projects} {...projects} />
      case "skills":
        return <SkillsSection skills={resume.data.skills} role={resume.data.personal.role} />
      case "languages":
        return <RepeatableSection config={languagesConfig} items={resume.data.languages} {...languages} />
      case "achievements":
        return <RepeatableSection config={achievementsConfig} items={resume.data.achievements} {...achievements} />
      case "certifications":
        return <RepeatableSection config={certificationsConfig} items={resume.data.certifications} {...certifications} />
      case "publications":
        return <RepeatableSection config={publicationsConfig} items={resume.data.publications} {...publications} />
      case "internships":
        return <RepeatableSection config={internshipsConfig} items={resume.data.internships} {...internships} />
      case "volunteer":
        return <RepeatableSection config={volunteerConfig} items={resume.data.volunteer} {...volunteer} />
      case "references":
        return <RepeatableSection config={referencesConfig} items={resume.data.references} {...references} />
      default: {
        if (meta.ref.startsWith("custom:")) {
          const section = resume.data.customSections.find((s) => s.id === meta.ref.slice(7))
          if (section) return <CustomSectionEditor section={section} />
        }
        return null
      }
    }
  }

  return (
    <div className="space-y-3">
      {personalMeta && (
        <SectionShell
          id="personal"
          label="Personal Details"
          visible
          pinned
          collapsed={personalMeta.collapsed}
          onToggleVisible={() => {}}
          onToggleCollapsed={() => toggleSectionCollapsed("personal")}
        >
          <PersonalSection personal={resume.data.personal} showPhotoUpload={template.hasPhoto} />
        </SectionShell>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rest.map((s) => s.ref)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {rest.map((meta) => (
              <SectionShell
                key={meta.ref}
                id={meta.ref}
                label={meta.label}
                visible={meta.visible}
                collapsed={meta.collapsed}
                onToggleVisible={() => toggleSectionVisibility(meta.ref)}
                onToggleCollapsed={() => toggleSectionCollapsed(meta.ref)}
                onDelete={meta.ref.startsWith("custom:") ? () => removeCustomSection(meta.ref.slice(7)) : undefined}
              >
                {renderContent(meta)}
              </SectionShell>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={() => setAddingSection(true)} className="w-full">
        <Plus className="size-4" aria-hidden="true" />
        Add custom section
      </Button>
      <PromptDialog
        open={addingSection}
        onOpenChange={setAddingSection}
        title="Add custom section"
        label="Section title"
        confirmLabel="Add"
        onConfirm={(title) => addCustomSection(title)}
      />
    </div>
  )
}
