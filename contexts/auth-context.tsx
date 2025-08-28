"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/auth"
import { AuthService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { user: loggedInUser, error } = await AuthService.login(email, password)

    if (loggedInUser) {
      setUser(loggedInUser)
      return { success: true }
    }

    return { success: false, error: error || "فشل في تسجيل الدخول" }
  }

  const signup = async (name: string, email: string) => {
    const { user: newUser, error } = await AuthService.signup(name, email)

    if (newUser) {
      setUser(newUser)
      return { success: true }
    }

    return { success: false, error: error || "فشل في إنشاء الحساب" }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
