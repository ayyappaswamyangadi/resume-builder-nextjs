"use client"

import * as React from "react"

const PAGE_WIDTH_PX = 794 // 210mm at 96dpi
const PAGE_HEIGHT_PX = 1123 // 297mm at 96dpi

/** Scales an A4Page down (via CSS transform, not just width) so text shrinks proportionally with the container. */
export function ScaledPagePreview({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? PAGE_WIDTH_PX
      setScale(Math.min(1, width / PAGE_WIDTH_PX))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full">
      <div style={{ width: PAGE_WIDTH_PX * scale, height: PAGE_HEIGHT_PX * scale }}>
        <div style={{ width: PAGE_WIDTH_PX, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    </div>
  )
}
