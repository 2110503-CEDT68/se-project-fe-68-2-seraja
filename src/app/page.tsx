"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Banner from "@/components/layout/Banner"
import { useAuth } from "@/libs/hooks/useAuth"

export default function HomePage() {
  const router = useRouter()
  const { user, logout, isAdmin } = useAuth()

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} onLogout={logout} />
      <Banner />

      {/* About section anchor */}
      <div id="about" className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-600">
          ✦ About Us ✦
        </p>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Your Gateway to the Great Outdoors
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500">
          We curate the best campgrounds across the country so you can spend
          less time searching and more time enjoying nature. Browse, book, and
          go — it&apos;s that simple.
        </p>
        <button
          onClick={() => router.push("/campgrounds")}
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Browse All Campgrounds
        </button>
      </div>
    </>
  )
}