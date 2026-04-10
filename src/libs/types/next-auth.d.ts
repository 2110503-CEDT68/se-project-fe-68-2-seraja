import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role from the backend API. */
      role: "user" | "admin" | "campOwner";
      /** The JWT token from the backend API. */
      token: string;
      /** The user's database ID. */
      _id: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: "user" | "admin"| "campOwner";
    token: string;
    _id: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role: "user" | "admin"| "campOwner";
    token: string;
    _id: string;
  }
}