import { Image, Text, View } from "@react-pdf/renderer"

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  return (parts[0][0] + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase()
}

export function PdfProfilePhoto({
  photoUrl,
  fullName,
  size = 80,
  shape = "circle",
  backgroundColor = "#1d4ed8",
}: {
  photoUrl: string
  fullName: string
  size?: number
  shape?: "circle" | "square"
  backgroundColor?: string
}) {
  const borderRadius = shape === "circle" ? size / 2 : 6

  if (photoUrl) {
    // eslint-disable-next-line jsx-a11y/alt-text -- this is @react-pdf/renderer's PDF Image primitive, not an HTML <img>
    return <Image src={photoUrl} style={{ width: size, height: size, borderRadius, objectFit: "cover" }} />
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#ffffff", fontSize: size * 0.36, fontWeight: 700 }}>{getInitials(fullName || "Your Name")}</Text>
    </View>
  )
}
