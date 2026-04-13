"use client"

import Link from "next/link"
import Button from "@/components/ui/Button"

interface NavbarProps {
  user?: {
    name?: string | null
    email?: string | null
    role?: "user" | "admin" | "campOwner"
  } | null
  isAdmin?: boolean
  onLogout?: () => void
}

export default function Navbar({
  user,
  isAdmin = false,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-gray-900 transition hover:text-blue-600">
            Campground Booking
          </Link>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-600 transition hover:text-blue-600">
              Home
            </Link>
            <Link href="/campgrounds" className="text-sm font-medium text-gray-600 transition hover:text-blue-600">
              Campgrounds
            </Link>
            <Link href="/bookings" className="text-sm font-medium text-gray-600 transition hover:text-blue-600">
              Bookings
            </Link>
            {user?.role === "campOwner" && (
              <Link href="/todayCheck" className="text-sm font-medium text-blue-600 font-bold transition hover:text-blue-700">
                Monitor
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role || "User"}</p>
              </div>
              <Button variant="outline" onClick={onLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="outline">Login</Button></Link>
              <Link href="/register"><Button>Register</Button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}