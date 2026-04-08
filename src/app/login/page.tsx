"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import PageContainer from "@/components/layout/PageContainer"
import LoginForm from "@/components/auth/LoginForm"
import { useAuth } from "@/libs/hooks/useAuth"
import { LoginCredentials } from "@/libs/types"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (data: LoginCredentials) => {
    setError(null)
    setLoading(true)
    try {
      // signIn with redirect:true won't return — page navigates away on success
      // signIn with redirect:false returns result we can check
      const { signIn } = await import("next-auth/react")
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (res?.error) {
        setError("Invalid email or password.")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Login</h1>
          <p className="mb-6 text-sm text-gray-500">
            Welcome back! Please sign in to continue.
          </p>

          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error ?? undefined}
          />

          <p className="mt-4 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </PageContainer>
    </>
  )
}