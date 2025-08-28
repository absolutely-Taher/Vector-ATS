"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requireRole?: "admin" | "applicant"
  redirectTo?: string
}

export function AuthGuard({ children, requireRole, redirectTo = "/login" }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requireRole && user.role !== requireRole) {
        // Redirect based on user role
        if (user.role === "admin") {
          router.push("/dashboard")
        } else {
          router.push("/jobs")
        }
        return
      }
    }
  }, [user, loading, requireRole, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-[#EAF0FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1F48FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#9FB0D3]">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user || (requireRole && user.role !== requireRole)) {
    return null
  }

  return <>{children}</>
}
