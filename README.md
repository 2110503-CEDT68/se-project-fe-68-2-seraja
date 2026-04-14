# SERaja Campground Booking Frontend

Frontend for the campground booking platform. The app is built with Next.js App Router, NextAuth credentials login, and a fetch-based API client that talks to the separate backend API.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- NextAuth.js
- Tailwind CSS 4
- Custom UI primitives for cards, buttons, inputs, and modals

## Features

- Public home page with a banner and campground discovery entry point
- Campground browsing with loading, empty, and error states
- Campground detail view with booking modal
- Booking form validation with date checks and a 3-night maximum stay rule
- Credentials-based authentication with registration and login flows
- Role-aware booking dashboard for user, camp owner, and admin sessions
- Guest booking, CSV export, check-in, check-out, cancel, edit, and delete actions where allowed
- Camp owner arrivals monitor for same-day check-in and check-out management
- Shared navigation that changes based on auth state and role

## Project Structure

- `src/app` - App Router pages, layouts, and API route handlers for NextAuth
- `src/components` - Shared UI, layout, auth, campground, and booking components
- `src/libs` - API client and custom hooks for auth, campgrounds, and bookings
- `src/providers` - NextAuth session provider
- `src/types` - Shared TypeScript types and NextAuth module augmentation

## Getting Started

1. Install dependencies.

```bash
npm install
```

2. Create a `.env.local` file in the project root and set the backend API base URL.

```bash
NEXT_PUBLIC_API_URL=seraja-backend-production-d4a4.up.railway.app/api/v1
```

The app expects `NEXT_PUBLIC_API_URL` for campground and booking requests. Authentication code has a fallback backend URL, but the main API client does not, so setting this variable is required for the app to work correctly.

3. Start the development server.

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Routes

- `/` - Home page
- `/campgrounds` - Campground list
- `/campgrounds/[id]` - Campground details and booking flow
- `/bookings` - Booking dashboard
- `/login` - Login page
- `/register` - Registration page
- `/todayCheck` - Camp owner arrivals monitor
- `/user/reviews` - User review section scaffold
- `/owner/reviews` - Camp owner review section scaffold

## Notes

- Session state is provided globally through the root layout, so auth works across all routes.
- The UI uses custom fonts and a warm neutral theme defined in `src/app/globals.css` and `src/app/layout.tsx`.
- Remote images are configured in `next.config.ts` for the backend, Unsplash, and Picsum hosts.

## Deployment

When deploying, make sure the backend API is reachable from the frontend and that `NEXT_PUBLIC_API_URL` points to the production API base path.
