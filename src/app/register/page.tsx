"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import PageContainer from "@/components/layout/PageContainer"
import RegisterForm from "@/components/auth/RegisterForm"
import { useAuth } from "@/libs/hooks/useAuth"
import { RegisterData } from "@/libs/types"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (data: RegisterData) => {
    setError(null)
    setLoading(true)
    try {
      await register(data)
      // register() auto-logs in via login() → signIn with redirect:true → navigates away
      // but if redirect:true is used, we also push as fallback
      router.push("/")
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mb-6 text-sm text-gray-500">
            Sign up to start booking your perfect campground.
          </p>

          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            error={error ?? undefined}
          />

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </PageContainer>
    </>
  )
}