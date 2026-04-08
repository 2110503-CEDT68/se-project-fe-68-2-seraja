"use client"

import { useState } from "react"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { RegisterData } from "@/libs/types"

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void> | void
  loading?: boolean
  error?: string
}

export default function RegisterForm({
  onSubmit,
  loading = false,
  error,
}: RegisterFormProps) {
  const [name, setName] = useState("")
  const [tel, setTel] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name || !tel || !email || !password) return

    await onSubmit({
      name,
      tel,
      email,
      password,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Telephone"
        type="tel"
        placeholder="Enter your phone number"
        value={tel}
        onChange={(e) => setTel(e.target.value)}
        required
      />

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

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" loading={loading} fullWidth>
        Register
      </Button>
    </form>
  )
}