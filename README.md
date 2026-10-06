# Resume Builder

A production-ready resume builder: live split-pane editor, 10 professionally designed templates, deep visual customization, high-quality PDF export, and guest-mode-first architecture that syncs to Firebase once a user signs in.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4, shadcn/ui (Base UI primitives, not Radix — see note below) |
| Animation | Motion (`motion/react`, the successor to Framer Motion) |
| Forms & validation | React Hook Form + Zod |
| State | Zustand |
| Drag & drop | dnd-kit (pointer + keyboard sensors) |
| PDF export | @react-pdf/renderer (client-only, vector, selectable text) |
| Backend | Firebase Auth, Cloud Firestore, Firebase Storage |
| Hosting | Firebase Hosting (static export) |

> **Note on shadcn/ui:** the installed shadcn CLI version generates components on top of **Base UI**, not Radix. There is no `asChild` prop — polymorphism goes through a `render={<Link .../>}` prop instead. Keep this in mind if you add new shadcn components.

## Features

- **Auth**: Google, email/password, and Guest mode (fully local, no Firebase project required to try the app).
- **Autosave**: every change persists instantly — to `localStorage` as a guest, to Firestore when signed in. Guest resumes migrate to your account automatically on first sign-in.
- **Dashboard**: create, duplicate, rename, delete, preview, and download resumes.
- **Builder**: split-pane form/live-preview editor. Every section (Experience, Education, Projects, Skills, Languages, Achievements, Certifications, Publications, Internships, Volunteer Work, Hobbies, References, and unlimited **custom sections**) supports add/edit/delete, drag-and-drop reordering (mouse and keyboard), and collapse/expand.
- **10 templates**: Modern ATS, Professional Blue, Minimal Elegant, Corporate Executive, Creative Designer, Material Style, Classic Resume, Modern Green, Elegant Purple, and Premium Portfolio (flagship). Exactly 3 (Corporate Executive, Creative Designer, Premium Portfolio) support a profile photo, with a clean initials-avatar fallback when none is uploaded.
- **Customization**: primary/accent color, font family (7 Google Fonts), font size, section spacing, page margins, heading style, border radius, and icon style — all applied live to both the on-screen preview and the exported PDF from one shared token system (`src/lib/templates/tokens.ts`).
- **PDF export**: a dedicated `@react-pdf/renderer` document per template, sharing the same design tokens as the web preview. A4, self-hosted fonts, selectable text, high resolution, sensible page-break behavior (`wrap={false}` on atomic blocks like an experience entry).
- **AI hooks (placeholder architecture)**: Improve Summary, Generate Career Objective, Rewrite Experience bullets, Generate Skills, Generate Project Description. All wired into the UI and running against local stub logic in `src/services/ai` — swap the implementation for a real provider without touching any call site.
- **Theming**: light / dark / auto (system), via `next-themes`.
- **Responsive**: desktop split-pane, tablet, and mobile (Edit/Preview tab switcher in the builder).
- **Accessibility**: keyboard-operable drag-and-drop (dnd-kit `KeyboardSensor`), ARIA labels on icon-only controls, focus-visible states throughout.

## Folder structure

```
src/
  app/                 Routes (App Router): /, /login, /signup, /dashboard, /builder, /templates
  components/
    auth/              Auth guard + shared auth UI
    builder/           Split-pane editor: SectionsEditor, RepeatableSection, dnd-kit wiring
    customization/     Customization sheet (colors, fonts, spacing, ...)
    dashboard/         Resume cards, preview dialog
    gallery/           Template gallery card
    layout/            App topbar
    pdf/               @react-pdf/renderer primitives + one Document per template
    providers/         Theme/toast/bootstrap providers
    shared/            Small reusable pieces (icons, dialogs, theme toggle)
    templates/         Web preview primitives + one Preview component per template
    ui/                shadcn/ui primitives
  constants/           Section configs, fonts, colors, sample resume data
  hooks/               useAppBootstrap, useRepeatableActions, useCustomSectionActions
  lib/
    firebase/          Firebase client init (no-ops gracefully if unconfigured)
    pdf/               Font registration, PDF StyleSheet factory, render/export entrypoints
    resume/            Resume factory (empty/default resume, duplication)
    templates/         Design-token resolver + template registry
    validation/        Zod schemas
  services/
    ai/                Placeholder AI functions
    repository/        LocalResumeRepository (guest) / FirestoreResumeRepository (signed-in)
  store/               Zustand stores (auth, resume)
  types/               Shared TypeScript types
public/fonts/          Self-hosted Google Font TTFs, used by @react-pdf/renderer
```

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. **Guest mode works immediately with zero configuration** — click "Continue as Guest" and everything is stored in your browser's `localStorage`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Firebase project's config to enable Google/email sign-in and cloud sync:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Leave these blank and the app runs entirely in guest mode (no backend calls attempted). All Firebase config is `NEXT_PUBLIC_*` because Firebase Auth/Firestore/Storage are called directly from the browser via the client SDK — there's no server component or API route involved (see "Why a static export" below).

## Firebase project setup

1. Create a project at https://console.firebase.google.com.
2. **Authentication** → Sign-in method → enable **Google** and **Email/Password**.
3. **Firestore Database** → create in production mode (any region). This repo's `firestore.rules` scopes every `resumes/{id}` document to its `ownerId`, and `templates/{id}` is public-read/no-write.
4. **Storage** → get started (used for profile photos / logos / export history — see `storage.rules`).
5. **Project settings** → General → "Your apps" → add a Web app → copy the config values into `.env.local`.
6. Deploy the security rules (see below).

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # pick your Firebase project, alias it e.g. "default"
firebase deploy --only firestore:rules,storage:rules
```

## Deployment guide (Firebase Hosting)

This app builds to a **static export** (`next.config.ts` sets `output: "export"`). That's a deliberate choice: Firebase Hosting's Next.js SSR integration requires the paid Blaze plan, while a static export — with all Firebase calls made client-side — works on the free **Spark plan**.

```bash
npm run build        # outputs to ./out
firebase deploy --only hosting
```

`firebase.json` is already configured to serve the `out/` directory with clean URLs and long-lived caching for static assets (JS/CSS/fonts).

If you'd rather deploy to Vercel/Netlify instead of Firebase Hosting, the static export works there too — just point the platform at the `out/` directory (or drop `output: "export"` from `next.config.ts` to use their native Next.js runtime instead).

**Google sign-in on Vercel (Safari).** Safari blocks the cross-site storage that `signInWithPopup` relies on when the app's domain differs from `authDomain`. `vercel.json` proxies `/__/auth/*` to `<project>.firebaseapp.com` so the auth handler is same-origin. For that to take effect:

1. Set `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` in Vercel to your Vercel domain (e.g. `your-app.vercel.app`) and redeploy.
2. In Google Cloud Console → APIs & Services → Credentials → the "Web client (auto created by Google Service)" OAuth client, add `https://your-app.vercel.app/__/auth/handler` to **Authorized redirect URIs**.
3. In Firebase Console → Authentication → Settings → **Authorized domains**, add `your-app.vercel.app`.

## AI features

No AI API key is required to run or evaluate this app. Every AI-labeled button (Improve with AI, Generate with AI, Rewrite with AI) calls a function in `src/services/ai/index.ts` that resolves locally after a short simulated delay. To connect a real provider, replace the body of `simulate()` in `src/services/ai/client.ts` with a `fetch` call — every function signature in `src/services/ai/index.ts` stays the same, so no call site needs to change.

## Known limitations

- Sidebar-layout PDF templates (Professional Blue, Creative Designer, Premium Portfolio) render their colored sidebar to fill one page; on a resume long enough to spill to a second page, the sidebar background won't continue onto page 2 (a known constraint of paginated PDF layout engines).
- The "Premium Portfolio" template is an original design inspired by common premium resume layouts — no specific proprietary template was reproduced.
