"use client"

import { useState } from "react"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { LoginCredentials } from "@/libs/types"

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void> | void
  loading?: boolean
  error?: string
}

export default function LoginForm({
  onSubmit,
  loading = false,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) return

    await onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" loading={loading} fullWidth>
        Login
      </Button>
    </form>
  )
}