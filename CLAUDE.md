# Ask me any questions if there are things you don't understand. This will be the basis for the rest of our conversations.

# Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering. Make sure to investigate and read relevant files BEFORE answering questions about the codebase. Never make any claims about code before investigating unless you are certain of the correct answer - give grounded and hallucination-free answers.

# Explain the technical architecture, the structure of the codebase and how the various parts are connected, the technologies used, why we made these technical decisions, and lessons I can learn from it (this should include the bugs we ran into and how we fixed them, potential pitfalls and how to avoid them in the future, new technologies used, how good engineers think and work, best practices, etc). It should be very engaging to read; don't make it sound like boring technical documentation/textbook. Where appropriate, use analogies and anecdotes to make it more understandable and memorable.

> This is a **Next.js 16 (App Router)** project using **React 19**, **TypeScript**, and **Tailwind CSS v4**. This is NOT the Next.js you may know from older training data — APIs, conventions, and file structure may differ. Read the relevant guide in `node_modules/next/dist/docs/` before writing code that touches framework APIs, and heed deprecation notices.

## General

- Follow these rules strictly when generating code or solutions:
- Keep solutions simple, minimal, and direct.
- Avoid unnecessary abstractions, layers, and complexity.
- Do not over-engineer.
- Prefer self-contained logic by default.
- If you are not 100% certain about any requirement or implementation detail, STOP and ask questions before writing code.
- Do not assume.
- Do not guess.
- Do not invent behavior.
- Clarify all uncertainties first, then proceed.
- When building user interfaces, prefer using shadcn/ui components.

## Server vs Client Components

This is the single most important mental model in the App Router.

- **Default to Server Components.** Every component is a Server Component unless it opts out. They fetch data, run on the server, and ship zero JS to the browser.
- Only add `'use client'` at the top of a file when the component needs interactivity: `useState`, `useEffect`, event handlers (`onClick`, `onChange`), browser APIs, or client-only hooks (`useRouter`, `usePathname`).
- Push `'use client'` to the leaf — keep it as low in the tree as possible. A button needs interactivity; the page wrapping it usually does not.
- Server Components can import and render Client Components, but not the other way around. Pass Server-fetched data down as props/children.

## Form Validations

- Always use **yup** for form validations.
- Pair yup with `react-hook-form` via `@hookform/resolvers/yup` for client-side forms. The form component must be a Client Component (`'use client'`).
- Define the yup schema once and infer the TypeScript type from it (`yup.InferType<typeof schema>`) — never hand-write a duplicate type.

## Typing

All global/shared type definitions live under the `types/` folder.

- Important Rules:

- We do NOT use `import`/`export` syntax for global type definitions — they are declared globally so they are available everywhere without imports.
- Global type files use the `.d.ts` extension: `[FILE_NAME].d.ts`
- Types declared in these files are globally available without explicit imports
- Example structure:

```
types/
    ├── api.d.ts
    ├── chat.d.ts
    ├── user.d.ts
    └── ad.d.ts
```

```typescript
// types/user.d.ts
declare global {
  interface User {
    id: string
    fullName: string
    email: string
  }
}

export {}
```

> Note: yup-inferred types and component prop types stay local to their file. The `types/` folder is for shared domain models only.

## Data Fetching

Next.js App Router has two distinct paths. Pick based on whether the component is a Server or Client Component.

### Server Components (default, preferred)

Fetch directly in an `async` component using the native `fetch`. No library needed.

- Loading state is handled by `loading.tsx` / `<Suspense>`, NOT inline.
- Error state is handled by `error.tsx` error boundaries, NOT inline.
- Choose the caching strategy explicitly with `fetch(url, { cache, next })` — don't rely on defaults you haven't read.

```tsx
// app/ads/page.tsx (Server Component)
export default async function AdsPage() {
  const res = await fetch('https://api.example.com/ads', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load ads') // caught by error.tsx
  const ads: Ad[] = await res.json()

  return <AdList ads={ads} />
}
```

```tsx
// app/ads/loading.tsx — shown automatically while the page streams
export default function Loading() {
  return <AdCardSkeleton />
}
```

```tsx
// app/ads/error.tsx — must be a Client Component
'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorMessage onRetry={reset} />
}
```

### Client Components (when you need client-side fetching)

Use **SWR** (or React Query if already present). Always handle all three states.

- Never use only `data` without handling loading and error.

```tsx
'use client'
import useSWR from 'swr'

export default function AdList() {
  const { data, isLoading, error } = useSWR<Ad[]>('/api/ads', fetcher)

  if (error) return <ErrorMessage />
  if (isLoading) return <AdCardSkeleton />
  return <ul>{data!.map((ad) => <AdCard key={ad.id} ad={ad} />)}</ul>
}
```

## Component Structure

- Each section must be created as a separate component file.
- Reusable / shared components live in `components/`. Route-specific components can live in a `_components/` folder colocated next to the route (the `_` prefix keeps it out of routing).
- Break down pages into logical sections.
- Each section = separate component file.
- Components are imported explicitly using the `@/` path alias — there is no auto-import.
- Promote reusability and maintainability.

### Example Structure:

```tsx
// app/dashboard/page.tsx
import StatsSection from '@/components/stats-section'
import AdListSection from '@/components/ad-list-section'
import ActivitySection from '@/components/activity-section'

export default function DashboardPage() {
  return (
    <main>
      <StatsSection />
      <AdListSection />
      <ActivitySection />
    </main>
  )
}
```

```
components/
    ├── stats-section.tsx
    ├── ad-list-section.tsx
    └── activity-section.tsx
```

### Why This Matters:

- Each component in its own file maintains proper boundaries (and clear Server/Client split)
- Better performance and debugging
- Better code organization
- Easier testing and maintenance
- Component reusability
- Clearer separation of concerns

## Prop Definitions

- NEVER destructure an object into many individual props when passing it down. Pass the whole object instead.

```tsx
// ❌ DON'T DO THIS
<Component a={object.a} b={object.b} c={object.c} d={object.d} />

// ✅ DO THIS INSTEAD
<Component data={object} />
```

### Self-Contained Components

- CRITICAL: If a component only performs navigation or a simple action, DO NOT pass event callbacks.
- Components should handle their own navigation logic internally using `next/link` (`<Link>`) or `useRouter()` from `next/navigation`.
- Only pass callbacks when the parent needs to control complex business logic.

```tsx
// ❌ DON'T DO THIS
// Parent
<AddAdButton onClick={handleAddAd} />

// ✅ DO THIS INSTEAD
// Parent
<AddAdButton />

// Child component — handles navigation internally
'use client'
import { useRouter } from 'next/navigation'

export default function AddAdButton() {
  const router = useRouter()
  return <button onClick={() => router.push('/ads/register')}>Add</button>
}
```

> For pure navigation, prefer `<Link href="...">` over a `useRouter().push` click handler — it works without JS and is the semantic choice.

### When to use callback props vs self-contained:

- Use callback props when:
  - Parent needs to update state based on child action
  - Complex business logic that affects multiple components
  - Parent manages data that the child needs to update

- Self-contained when:
  - Simple navigation
  - Opening modals/dialogs
  - Simple UI state changes that don't affect the parent

### CRITICAL: Components Should Fetch Their Own Data

- **RULE**: Components should fetch the data they need themselves. In the App Router this means: make the component an `async` Server Component and `fetch` inside it, rather than fetching in a parent and drilling props down.
- **NEVER** pass data as props that the component can fetch itself.
- **NEVER** pass derived/computed values (like `userName`, `displayName`, `greeting`) as props — compute them where they're used.
- Each component is responsible for its own data requirements.

```tsx
// ❌ DON'T DO THIS — parent fetches and drills down
export default async function Page() {
  const user = await getUser()
  const displayName = user.fullName ?? 'User'
  return <Greeting displayName={displayName} />
}

// ✅ DO THIS — child fetches and derives its own data
export default async function Greeting() {
  const user = await getUser()
  const displayName = user.fullName ?? 'User'
  return <h1>Hello, {displayName}</h1>
}
```

## Loading States — Skeleton

- ALWAYS use skeleton placeholders for loading states, never a spinner or empty view.
- Drive route-level loading with `loading.tsx`, and component-level loading with `<Suspense fallback={<Skeleton />}>`.
- Build skeletons with plain HTML + Tailwind classes — no external library needed.
- Use Tailwind's `animate-pulse` for the shimmer/pulse animation.
- Create a dedicated `*-skeleton.tsx` component that mirrors the real card/item layout.

```tsx
// components/ad-card-skeleton.tsx
export default function AdCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 animate-pulse">
      <div className="size-11 rounded-full bg-gray-200" />
      <div className="h-3.5 w-3/5 rounded bg-gray-200" />
    </div>
  )
}
```

## Conditional UI States

- In Server Components, prefer the framework's file conventions: `error.tsx` for errors, `loading.tsx` / `<Suspense>` for loading.
- In Client Components, use early returns or ternaries with a clear priority order: **error → loading → content**.

```tsx
'use client'

if (error) return <ErrorMessage />
if (isLoading) return <AdCardSkeleton />
return <AdList ads={data} />
```

## Conditions & Magic Strings/Numbers

- Never use magic strings or numbers in the codebase. Always replace them with well-named constants or enums.

```typescript
// ✅ Prefer
const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const

// ❌ Avoid
if (user.role === 'admin') { ... }
```

## SEO & Metadata

Every route MUST define metadata using Next.js's **Metadata API** — either a static `metadata` export or an async `generateMetadata` function. Search engines and social media platforms rely on this to understand and preview your pages — without it, your page is essentially invisible to crawlers and looks broken when shared on WhatsApp, Twitter, LinkedIn, etc.

### Mandatory for every route:

- `title` — Page title (shown in browser tab + search results)
- `description` — Short summary (shown under the title in Google results, ~155 chars)
- Open Graph fields (`openGraph.title`, `openGraph.description`, `openGraph.images`, `openGraph.url`) — Social media previews

### How to use:

```tsx
// app/ads/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reklam Sorgula | Adproof',
  description: 'Reklamlarınızın kanıtını güvenle saklayın ve doğrulayın.',
  openGraph: {
    title: 'Reklam Sorgula | Adproof',
    description: 'Reklamlarınızın kanıtını güvenle saklayın ve doğrulayın.',
    images: ['/images/og-cover.png'],
    url: 'https://adproof.com/ads',
  },
}
```

For dynamic routes, use `generateMetadata({ params })` to build metadata from the fetched record. Set a shared default in the root `app/layout.tsx` and override per route.

### Why this matters:

- Google indexes your pages better with a proper title + description
- Social media previews (WhatsApp, Twitter, LinkedIn) use OG tags — without them, shared links look empty
- The title tag is one of the strongest on-page SEO signals
- Each route needs unique metadata — don't use the same title everywhere

## Semantic HTML & Accessibility

Always use semantic HTML elements instead of generic `<div>` tags. Semantic HTML tells browsers, screen readers, and search engines **what** the content is, not just how it looks.

### Rules:

- Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` where appropriate
- Use heading hierarchy properly (`<h1>` → `<h2>` → `<h3>`) — one `<h1>` per page
- Add `alt` text to all `<img>` / `next/image` tags (decorative images: `alt=""`)
- Add `aria-label` to interactive elements without visible text (icon buttons, links)
- Use `<button>` for actions, `<Link>` (`next/link`) for navigation — never swap them
- Use `<form>` for input groups; on the client, handle submit with `onSubmit` + `event.preventDefault()` (or a server action)

```tsx
// ❌ Avoid: div soup
<div className="header"><div className="nav">...</div></div>
<div className="content">...</div>
<div className="footer">...</div>

// ✅ Prefer: semantic structure
<header><nav aria-label="Ana menü">...</nav></header>
<main><section>...</section></main>
<footer>...</footer>
```

## Images

- Use `next/image` (`<Image>`) instead of raw `<img>` for automatic optimization, lazy loading, and correct sizing.
- Always provide `width`/`height` (or `fill` with a sized container) and meaningful `alt` text.

## File Naming Conventions

All non-route files in the project must follow **kebab-case** naming convention.

### Rules:

- Use lowercase letters only
- Separate words with hyphens (-)
- No spaces, underscores, or camelCase
- Be descriptive but concise

### Examples:

```
✅ Correct:
  user-profile.tsx
  chat-message.tsx
  ad-card-skeleton.tsx
  use-auth.ts
  use-chat.ts

❌ Wrong:
  UserProfile.tsx
  chatMessage.tsx
  useAuth.ts
```

### Notes:

- The **component (the default export) is named in PascalCase**, even though the file is kebab-case:
  ```
  File: ad-card.tsx        → export default function AdCard() {}    → <AdCard />
  File: chat-message.tsx   → export default function ChatMessage() {} → <ChatMessage />
  ```
- Next.js **route files are reserved names** and are an exception: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `template.tsx`. Route **segment folders** are still kebab-case (`app/plate-search/page.tsx`), and dynamic segments use brackets (`app/ads/[id]/page.tsx`).

## Project Structure

```
app/
├── layout.tsx           # Root layout (html/body, shared metadata, fonts)
├── page.tsx             # Home route
├── globals.css          # Tailwind v4 entry + global styles
├── (routes)/            # File-based routing — each folder = a URL segment
│   ├── page.tsx         #   the rendered page
│   ├── layout.tsx       #   optional nested layout
│   ├── loading.tsx      #   skeleton fallback
│   ├── error.tsx        #   error boundary (Client Component)
│   └── _components/      #   route-specific components (excluded from routing)
├── api/                 # Route Handlers (route.ts) — backend endpoints
components/              # Shared, reusable components (kebab-case files)
lib/                     # Shared utilities, fetchers, constants, server helpers
hooks/                   # Reusable client hooks (use-*.ts)
types/                   # Global type definitions (.d.ts)
public/                  # Static assets served at the root
```

> Path alias: import with `@/...` (configured in `tsconfig.json` as `@/* → ./*`), e.g. `import { cn } from '@/lib/utils'`.
