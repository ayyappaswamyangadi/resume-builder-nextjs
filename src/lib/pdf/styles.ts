import { StyleSheet } from "@react-pdf/renderer"
import type { Style } from "@react-pdf/types"
import type { ResolvedTokens } from "@/lib/templates/tokens"

/** Shared react-pdf StyleSheet derived from the same tokens the web preview uses. */
export function createPdfStyles(tokens: ResolvedTokens) {
  return StyleSheet.create({
    page: {
      fontFamily: tokens.fontFamilyLabel,
      fontSize: tokens.size.base,
      color: tokens.text,
      lineHeight: 1.45,
      padding: `${tokens.spacing.pageMargin}mm`,
    },
    name: { fontSize: tokens.size.xxl, lineHeight: 1.2, fontWeight: 700, color: tokens.primary },
    role: { fontSize: tokens.size.lg, lineHeight: 1.3, color: tokens.muted, marginTop: 2 },
    text: { fontSize: tokens.size.base },
    small: { fontSize: tokens.size.sm },
    xsmall: { fontSize: tokens.size.xs, color: tokens.muted },
    muted: { color: tokens.muted },
    bold: { fontWeight: 700 },
    row: { flexDirection: "row", alignItems: "center" },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    wrapRow: { flexDirection: "row", flexWrap: "wrap" },
    section: { marginBottom: tokens.spacing.section },
    itemGap: { marginBottom: tokens.spacing.item },
    divider: { borderBottomWidth: 1, borderBottomColor: tokens.border },
    bulletRow: { flexDirection: "row", marginTop: 2 },
    bulletDot: { width: 10, fontSize: tokens.size.sm },
    bulletText: { flex: 1, fontSize: tokens.size.sm },
    contactItem: { flexDirection: "row", alignItems: "center", gap: 3, marginRight: 10 },
  })
}

export function getSectionHeadingStyle(tokens: ResolvedTokens): Style {
  const color = tokens.primary
  switch (tokens.headingStyle) {
    case "uppercase":
      return { fontSize: tokens.size.sm, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1 }
    case "bold":
      return { fontSize: tokens.size.lg, fontWeight: 700, color }
    case "underline":
      return {
        fontSize: tokens.size.base,
        fontWeight: 700,
        color,
        borderBottomWidth: 1.5,
        borderBottomColor: color,
        paddingBottom: 2,
      }
    case "boxed":
      return {
        fontSize: tokens.size.sm,
        fontWeight: 700,
        color,
        textTransform: "uppercase",
        backgroundColor: `${color}18`,
        paddingVertical: 2,
        paddingHorizontal: 6,
        alignSelf: "flex-start",
      }
    case "minimal":
    default:
      return { fontSize: tokens.size.sm, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: 1.5 }
  }
}
