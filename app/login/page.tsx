"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const pageVariants = {
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -24, filter: "blur(6px)" },
}

const pageTransition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 0.8,
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        toast.success("تم تسجيل الدخول بنجاح")

        // Route based on user role
        if (email === "admin@demo.com") {
          router.push("/dashboard")
        } else {
          router.push("/jobs")
        }
      } else {
        toast.error(result.error || "فشل في تسجيل الدخول")
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        ...pageTransition,
        type: "spring" as const,
      }}
      className="min-h-screen bg-[#0B0D12] text-[#EAF0FF] flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#1F48FF]" />
            <span className="text-2xl font-bold">VectorHire</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">أهلاً بعودتك</CardTitle>
            <p className="text-[#9FB0D3] text-sm">سجّل دخولك للوصول إلى حسابك</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9FB0D3]" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#11141B] border-white/10 pr-10 text-right"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium mb-2 block">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9FB0D3]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#11141B] border-white/10 pr-10 pl-10 text-right"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9FB0D3] hover:text-[#EAF0FF] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1F48FF] hover:bg-[#0E2CCF] text-white rounded-lg py-2.5"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-[#1F48FF]/10 border border-[#1F48FF]/20 rounded-lg">
              <h4 className="text-sm font-medium text-[#1F48FF] mb-2">بيانات تجريبية للإدارة:</h4>
              <div className="text-xs text-[#9FB0D3] space-y-1">
                <p>البريد: admin@demo.com</p>
                <p>كلمة المرور: Admin@123</p>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-[#9FB0D3] text-sm">
                ليس لديك حساب؟{" "}
                <Link href="/signup" className="text-[#1F48FF] hover:text-[#0E2CCF] font-medium">
                  أنشئ حساباً جديداً
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[#9FB0D3] hover:text-[#EAF0FF] text-sm transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
