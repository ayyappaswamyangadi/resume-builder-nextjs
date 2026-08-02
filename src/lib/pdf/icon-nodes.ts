/** Lucide-style icon shape data (24x24 viewBox) for rendering inside @react-pdf/renderer <Svg>. */

export type IconShape =
  | { tag: "path"; d: string }
  | { tag: "circle"; cx: string; cy: string; r: string }
  | { tag: "rect"; x: string; y: string; width: string; height: string; rx?: string }

export const ICON_NODES: Record<string, IconShape[]> = {
  mail: [
    { tag: "path", d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" },
    { tag: "rect", x: "2", y: "4", width: "20", height: "16", rx: "2" },
  ],
  phone: [
    {
      tag: "path",
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
    },
  ],
  globe: [
    { tag: "circle", cx: "12", cy: "12", r: "10" },
    { tag: "path", d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" },
    { tag: "path", d: "M2 12h20" },
  ],
  mapPin: [
    {
      tag: "path",
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
    },
    { tag: "circle", cx: "12", cy: "10", r: "3" },
  ],
  link: [
    { tag: "path", d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" },
    { tag: "path", d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" },
  ],
  linkedin: [
    { tag: "circle", cx: "6.94", cy: "5.06", r: "1.44" },
    { tag: "rect", x: "4", y: "9", width: "4", height: "11" },
    {
      tag: "path",
      d: "M10 9h3.8v1.6h.05c.53-.95 1.82-1.95 3.75-1.95 4 0 4.75 2.4 4.75 5.55V20h-4v-5.1c0-1.2-.02-2.75-1.7-2.75-1.7 0-1.96 1.3-1.96 2.65V20h-3.99z",
    },
  ],
  github: [
    {
      tag: "path",
      d: "M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
    },
  ],
}
