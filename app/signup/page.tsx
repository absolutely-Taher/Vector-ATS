"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Mail, User } from "lucide-react"
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
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.8,
}

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signup(name, email)

      if (result.success) {
        toast.success("تم إنشاء الحساب بنجاح")
        router.push("/jobs")
      } else {
        toast.error(result.error || "فشل في إنشاء الحساب")
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إنشاء الحساب")
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
      transition={pageTransition}
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

        {/* Signup Card */}
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">أنشئ حساباً</CardTitle>
            <p className="text-[#9FB0D3] text-sm">انضم إلينا وابدأ في التقديم على الوظائف</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                  الاسم الكامل
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9FB0D3]" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#11141B] border-white/10 pr-10 text-right"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>
              </div>

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

              <Button
                type="submit"
                className="w-full bg-[#1F48FF] hover:bg-[#0E2CCF] text-white rounded-lg py-2.5"
                disabled={isLoading}
              >
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </Button>
            </form>

            {/* Demo Note */}
            <div className="mt-6 p-4 bg-[#00C2A8]/10 border border-[#00C2A8]/20 rounded-lg">
              <p className="text-xs text-[#00C2A8]">
                ملاحظة: هذا حساب متقدّم للعرض التجريبي. يمكنك التقديم على الوظائف ومشاهدة النتائج.
              </p>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-[#9FB0D3] text-sm">
                لديك حساب بالفعل؟{" "}
                <Link href="/login" className="text-[#1F48FF] hover:text-[#0E2CCF] font-medium">
                  سجّل دخولك
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
