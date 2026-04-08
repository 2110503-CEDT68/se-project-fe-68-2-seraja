import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cedt-be-for-fe-proj.vercel.app/api/v1";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });

        const json = await res.json();

        if (!res.ok || !json?.token) return null;

        // Backend only returns { success, token } — no user data
        // So we call /auth/me with the token to get user info
        const meRes = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${json.token}` },
        });

        const meJson = await meRes.json();

        if (!meRes.ok || !meJson?.data) return null;

        return {
          id: meJson.data._id,
          name: meJson.data.name,
          email: meJson.data.email,
          role: meJson.data.role,
          token: json.token,
          _id: meJson.data._id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.token = user.token;
        token._id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.token = token.token;
        session.user._id = token._id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};