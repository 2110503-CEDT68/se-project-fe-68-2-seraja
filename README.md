# SERaja — Campground Booking Frontend

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://seraja-frontend.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

Frontend for **SERaja**, a campground discovery and booking platform. Built with the Next.js App Router, NextAuth credentials-based authentication, and a fetch-based API client that communicates with a separate backend service.

🌐 **Live:** [seraja-frontend.vercel.app](https://seraja-frontend.vercel.app/)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16 | App Router, SSR, routing |
| React | 19 | UI rendering |
| TypeScript | — | Static typing |
| NextAuth.js | — | Authentication (credentials) |
| Tailwind CSS | 4 | Utility-first styling |

Custom UI primitives are used for cards, buttons, inputs, and modals — no external component library dependency.

---

## Features

### Public
- Home page with banner and campground discovery entry point
- Campground browsing with loading, empty, and error states
- Campground detail view with integrated booking modal

### Booking
- Booking form with date validation and a **3-night maximum stay** rule
- Guest booking support (no account required)
- CSV export of booking records

### Authentication
- Credentials-based login and registration
- Role-aware session handling: `user`, `camp_owner`, `admin`

### Dashboard (Role-Gated)
- Unified booking dashboard with check-in, check-out, cancel, edit, and delete actions
- Camp owner arrivals monitor for same-day check-in and check-out management

### Navigation
- Shared navigation bar adapts dynamically to auth state and user role

---

## Project Structure

```
src/
├── app/                  # App Router pages, layouts, NextAuth API route handlers
├── components/           # Shared UI, layout, auth, campground, and booking components
├── libs/                 # API client and custom hooks (auth, campgrounds, bookings)
├── providers/            # NextAuth SessionProvider wrapper
└── types/                # Shared TypeScript types and NextAuth module augmentation
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the SERaja backend API

### Installation

1. **Clone the repository and install dependencies.**

```bash
npm install
```

2. **Configure environment variables.**

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=seraja-backend-production-d4a4.up.railway.app/api/v1
```

> **Note:** `NEXT_PUBLIC_API_URL` is required for all campground and booking requests. The authentication module has a fallback URL, but the main API client does not — omitting this variable will break core functionality.

3. **Start the development server.**

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile and optimize for production
npm run start    # Run the production build locally
npm run lint     # Run ESLint checks
```

---

## Routes

| Route | Description | Access |
|---|---|---|
| `/` | Home page | Public |
| `/campgrounds` | Campground listing | Public |
| `/campgrounds/[id]` | Campground details and booking flow | Public |
| `/login` | Login page | Public |
| `/register` | Registration page | Public |
| `/bookings` | Booking dashboard | Authenticated |
| `/todayCheck` | Arrivals monitor | Camp owner |
| `/user/reviews` | User review section | User |
| `/owner/reviews` | Camp owner review section | Camp owner |

---

## Architecture Notes

- **Session context** is provided globally through the root layout, ensuring auth state is consistently available across all routes without prop drilling.
- **Remote images** from the backend, Unsplash, and Picsum are allowlisted in `next.config.ts`.
- **Global styles** including custom fonts and the warm neutral theme are defined in `src/app/globals.css` and `src/app/layout.tsx`.

---

## Deployment

The app is deployed on [Vercel](https://vercel.com/). For any deployment target:

1. Ensure the backend API is reachable from the deployment environment.
2. Set `NEXT_PUBLIC_API_URL` to point to the production API base path.
3. Verify any CORS policies on the backend allow requests from the frontend origin.