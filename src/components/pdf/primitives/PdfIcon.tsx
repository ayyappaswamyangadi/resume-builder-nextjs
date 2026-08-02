import { Svg, Path, Circle, Rect } from "@react-pdf/renderer"
import { ICON_NODES } from "@/lib/pdf/icon-nodes"

export function PdfIcon({ name, color, size = 8 }: { name: keyof typeof ICON_NODES; color: string; size?: number }) {
  const shapes = ICON_NODES[name]
  if (!shapes) return null
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      {shapes.map((shape, i) => {
        if (shape.tag === "path") {
          return <Path key={i} d={shape.d} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        }
        if (shape.tag === "circle") {
          return <Circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} stroke={color} strokeWidth={2} fill="none" />
        }
        return (
          <Rect
            key={i}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            rx={shape.rx}
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        )
      })}
    </Svg>
  )
}
