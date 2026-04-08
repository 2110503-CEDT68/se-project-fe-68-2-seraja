'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { LoginCredentials, RegisterData } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cedt-be-for-fe-proj.vercel.app/api/v1";

export const useAuth = () => {
  const { data: session, status } = useSession();

  const register = async (data: RegisterData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ ...data, role: "user" }), // always default to user
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.message || json?.error || "Registration failed");
    }

    return await login({ email: data.email, password: data.password });
  };

  const login = async (credentials: LoginCredentials) => {
    return await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: true,
      callbackUrl: "/",
    });
  };

  const logout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return {
    user: session?.user ?? null,
    login,
    register,
    logout,
    loading: status === "loading",
    isAdmin: session?.user?.role === 'admin'
  };
};