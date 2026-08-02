import Image from "next/image"

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  return (parts[0][0] + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase()
}

export function ProfilePhoto({
  photoUrl,
  fullName,
  shape = "circle",
  size = 96,
  className = "",
  placeholderColor = "var(--tpl-primary)",
}: {
  photoUrl: string
  fullName: string
  shape?: "circle" | "square"
  size?: number
  className?: string
  /** Explicit background for the initials placeholder. Pass the resolved token color
   * (not "var(--tpl-primary)") when this photo sits inside a region that overrides
   * that CSS variable for text/heading color — e.g. a dark sidebar — to avoid an
   * invisible white-on-white placeholder. */
  placeholderColor?: string
}) {
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-[var(--tpl-radius)]"
  const dimension = { width: size, height: size }

  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={fullName ? `Photo of ${fullName}` : "Profile photo"}
        width={size}
        height={size}
        unoptimized
        className={`${shapeClass} object-cover shrink-0 ${className}`}
        style={dimension}
      />
    )
  }

  return (
    <div
      className={`${shapeClass} flex shrink-0 items-center justify-center text-white font-semibold ${className}`}
      style={{ ...dimension, fontSize: size * 0.36, backgroundColor: placeholderColor }}
      aria-label={fullName ? `${fullName} avatar placeholder` : "Avatar placeholder"}
      role="img"
    >
      {getInitials(fullName || "Your Name")}
    </div>
  )
}
