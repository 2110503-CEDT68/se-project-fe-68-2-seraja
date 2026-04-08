import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import "./globals.css"
import NextAuthProvider from "@/providers/NextAuthProvider"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Campground Booking",
  description: "Campground booking application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-screen flex flex-col bg-[#f5f3ef]">
        <NextAuthProvider>
          {/* We add 'flex-1' (which is flex-grow: 1) here.
              If the gap persists, it's because the NextAuthProvider 
              renders a <div> that isn't stretching. 
          */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  )
}