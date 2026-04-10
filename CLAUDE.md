@AGENTS.md

# Campground Booking System — Frontend

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| Auth | NextAuth v4 (Credentials + JWT) |
| HTTP | Native `fetch` via `apiClient` (axios is installed but not used) |

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── api/auth/[...nextauth]/ # NextAuth route + authOptions
│   ├── campgrounds/            # /campgrounds list page
│   ├── campgrounds/[id]/       # /campgrounds/:id detail page
│   ├── bookings/               # /bookings (auth-protected)
│   ├── login/                  # /login
│   ├── register/               # /register
│   ├── layout.tsx              # Root layout (fonts, NextAuthProvider)
│   └── page.tsx                # Home page
├── components/
│   ├── auth/                   # LoginForm, RegisterForm
│   ├── bookings/               # BookingCard, BookingForm, BookingList
│   ├── campgrounds/            # CampgroundCard, CampgroundDetailCard, CampgroundList
│   ├── common/                 # EmptyState, ErrorState, LoadingState
│   ├── layout/                 # Navbar, Banner, PageContainer
│   └── ui/                     # Button, Card, Input, Modal (primitives)
├── libs/
│   ├── api/apiClient.ts        # Single authenticated fetch wrapper
│   ├── hooks/                  # useAuth, useBookings, useCampgrounds
│   └── types/index.ts          # All shared TypeScript types
└── providers/
    └── NextAuthProvider.tsx    # Wraps SessionProvider
```

## Backend API

Base URL: `https://cedt-be-for-fe-proj.vercel.app/api/v1`
Controlled via env var `NEXT_PUBLIC_API_URL`.

| Method | Endpoint | Auth | Response |
|---|---|---|---|
| POST | `/auth/login` | No | `{ success, token }` |
| GET | `/auth/me` | Bearer | `{ data: User }` |
| POST | `/auth/register` | No | `{ success, token }` |
| GET | `/campgrounds` | No | `{ data: Campground[] }` |
| GET | `/campgrounds/:id` | No | `{ data: Campground }` |
| GET | `/bookings` | Bearer | `{ data: Booking[] }` |
| POST | `/campgrounds/:id/bookings` | Bearer | `{ data: Booking }` |
| PUT | `/bookings/:id` | Bearer | `{ data: Booking }` |
| DELETE | `/bookings/:id` | Bearer | `{}` |

## Auth Flow

1. NextAuth Credentials provider POSTs `/auth/login` for the token, then GETs `/auth/me` to hydrate user info.
2. JWT callback stores `role`, `token` (Bearer), and `_id` on the NextAuth JWT.
3. Session callback exposes them as `session.user.{ role, token, _id }`.
4. `apiClient` reads the session via `getSession()` and injects `Authorization: Bearer <token>` automatically.
5. `useAuth` wraps `signIn` / `signOut` and exposes `user`, `isAdmin`, `login`, `register`, `logout`, `loading`.

**Rule:** Never call auth endpoints directly from components — always use `useAuth`.

## API Client

`src/libs/api/apiClient.ts` is the only HTTP entry point for all non-auth requests.

- Always use `apiClient`, never raw `fetch` or `axios` in components or pages.
- Throws `Error` on non-2xx responses. Calling hooks are responsible for catching.

## Hooks

| Hook | Responsibility |
|---|---|
| `useAuth` | Session state, login, logout, register, `isAdmin` flag |
| `useCampgrounds` | Fetch list or single campground; resolves images via FEATURED_IMAGES map + picsum fallback |
| `useBookings` | Full CRUD for bookings |

- Hooks own their own `loading` and `error` state — do not duplicate this in pages or components.
- `useCampgrounds` applies image resolution (FEATURED_IMAGES hardcoded map → picsum seed fallback). Do not bypass or replicate this logic.

## Types

All shared types live in `src/libs/types/index.ts`:

`User`, `Campground`, `Booking`, `BookingInput`, `LoginCredentials`, `RegisterData`, `AuthResponse`

Always import from `@/libs/types`. Never redefine these types inline elsewhere.

## Component Conventions

- **UI primitives** (`ui/` — Button, Card, Input, Modal) are the base layer — all other components build on these.
- **Feature components** (`campgrounds/`, `bookings/`, `auth/`) consume hooks and render primitives.
- **Layout components** (`Navbar`, `Banner`, `PageContainer`) are page-level wrappers.
- **Pages** (`app/`) are thin — they compose layout + feature components with minimal logic.
- Any component that uses React hooks or browser APIs must have `"use client"` at the top.

## Styling

- Tailwind CSS v4 — utilities only. Do not create new CSS files; `globals.css` and `banner.module.css` are the only stylesheets.
- Body background: `bg-[#f5f3ef]` (warm off-white, set in root layout).
- Fonts are loaded as CSS variables in `layout.tsx`:
  - `--font-cormorant` → Cormorant Garamond (headings/display)
  - `--font-dm-sans` → DM Sans (body/UI)
- Apply fonts in Tailwind v4 with: `font-[family-name:var(--font-cormorant)]`

## Images

Always use `next/image` for campground pictures. Remote domains are whitelisted in `next.config.ts`:

- `cedt-be-for-fe-proj.vercel.app`
- `images.unsplash.com`
- `picsum.photos` / `fastly.picsum.photos`

Add new external image domains to `next.config.ts` before using them.

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (defaults to the Vercel deployment) |
| `NEXTAUTH_SECRET` | Required in production for NextAuth JWT signing |
| `NEXTAUTH_URL` | Required in production (e.g., `https://yourapp.com`) |

## Roles

- `user` — can view campgrounds and manage their own bookings (backend enforces max 3).
- `admin` — can view and manage all bookings.
- Gate admin-only UI with `isAdmin` from `useAuth`.

## Do Not

- Do not use `axios` — the project uses native `fetch` via `apiClient`.
- Do not call `fetch` directly in components or pages — use `useAuth` or the domain hooks.
- Do not introduce global state libraries (Redux, Zustand, Context, etc.) — hooks are sufficient.
- Do not store the Bearer token in `localStorage` — it lives in the NextAuth JWT cookie only.
