import type React from "react"
import type { Metadata } from "next"
import { Cairo, Tajawal, IBM_Plex_Sans_Arabic } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
})

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-tajawal",
})

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ibm-plex-arabic",
})

export const metadata: Metadata = {
  title: "VectorHire - نُقيّم السير الذاتية بالذكاء الاصطناعي",
  description: "ATS مدعوم بالذكاء الاصطناعي يُرتّب السير الذاتية مقابل وصف وظيفتك فورًا",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`font-sans antialiased ${cairo.variable} ${tajawal.variable} ${ibmPlexArabic.variable}`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
