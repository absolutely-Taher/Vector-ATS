"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import {
  Sparkles,
  Gauge,
  Fuel as Funnel,
  FileText,
  ShieldCheck,
  Briefcase,
  Upload,
  Cpu,
  ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScoreBadge } from "@/components/ui/score-badge"
import { PassedPill } from "@/components/ui/passed-pill"
import Link from "next/link"

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

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 160,
      damping: 20,
    },
  },
}

// Counting animation hook
function useCountUp(end: number, duration: number = 2000, delay: number = 0) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          setTimeout(() => {
            const startTime = Date.now()
            const startValue = 0
            
            const timer = setInterval(() => {
              const now = Date.now()
              const progress = Math.min((now - startTime) / duration, 1)
              const currentValue = Math.floor(startValue + (end - startValue) * progress)
              
              setCount(currentValue)
              
              if (progress === 1) {
                clearInterval(timer)
              }
            }, 16) // ~60fps
          }, delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, duration, delay, isVisible])

  return { count, ref }
}

// Stats Counter Component
function StatsCounter({ 
  end, 
  suffix = "", 
  color = "text-white", 
  label, 
  delay = 0 
}: { 
  end: number; 
  suffix?: string; 
  color?: string; 
  label: string; 
  delay?: number; 
}) {
  const { count, ref } = useCountUp(end, 2000, delay)

  return (
    <div ref={ref} className="text-center">
      <div className={`text-3xl font-bold ${color} mb-2`}>
        {count}{suffix}
      </div>
      <div className="text-[#9FB0D3] text-sm">{label}</div>
    </div>
  )
}

export default function HomePage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen text-[#EAF0FF]"
    >
      {/* Hero Section with Background */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%230B0D12;stop-opacity:1" /><stop offset="50%" style="stop-color:%2311141B;stop-opacity:1" /><stop offset="100%" style="stop-color:%230B0D12;stop-opacity:1" /></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="%231F48FF" stroke-width="0.5" opacity="0.1"/></pattern><radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:%231F48FF;stop-opacity:0.3" /><stop offset="70%" style="stop-color:%231F48FF;stop-opacity:0.1" /><stop offset="100%" style="stop-color:%231F48FF;stop-opacity:0" /></radialGradient></defs><rect width="100%" height="100%" fill="url(%23grad1)"/><rect width="100%" height="100%" fill="url(%23grid)"/><circle cx="300" cy="200" r="150" fill="url(%23glow)"/><circle cx="1600" cy="800" r="200" fill="url(%23glow)"/><circle cx="1200" cy="300" r="100" fill="url(%23glow)"/></svg>')`
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D12]/80 via-[#0B0D12]/60 to-[#0B0D12]/90"></div>
        
        {/* Navigation */}
        <nav className="relative z-50 glass border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#1F48FF]" />
                <span className="text-xl font-bold">VectorHire</span>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-[#9FB0D3] hover:text-[#EAF0FF] transition-colors">
                  الرئيسية
                </Link>
                <Link href="/jobs" className="text-[#9FB0D3] hover:text-[#EAF0FF] transition-colors">
                  الوظائف
                </Link>
                <Link href="/login" className="text-[#9FB0D3] hover:text-[#EAF0FF] transition-colors">
                  الإدارة
                </Link>
                <Link href="/#demo">
                  <Button className="bg-[#1F48FF] hover:bg-[#0E2CCF] text-white rounded-full px-4 py-2">احجز عرضًا</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-balance mb-8"
              >
                فلتر أذكى.
                <br />
                <span className="text-[#00C2A8]">توظيف أسرع.</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-[#9FB0D3] mb-12 text-pretty leading-relaxed">
                ATS مدعوم بالذكاء الاصطناعي يُرتّب السير الذاتية مقابل وصف وظيفتك فورًا.
                <br />
                <span className="text-lg text-[#9FB0D3]/80">حصل على أفضل المرشحين في دقائق، وليس أيام</span>
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Link href="/jobs">
                  <Button size="lg" className="bg-[#1F48FF] hover:bg-[#0E2CCF] text-white rounded-full px-10 py-4 text-lg font-semibold shadow-lg shadow-[#1F48FF]/25">
                    تصفّح الوظائف
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-10 py-4 border-white/20 text-[#EAF0FF] hover:bg-white/5 bg-transparent text-lg font-semibold backdrop-blur-sm"
                  >
                    لوحة الإدارة
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <StatsCounter end={95} suffix="%" color="text-[#1F48FF]" label="دقة التقييم" delay={0} />
                <StatsCounter end={30} suffix=" ثانية" color="text-[#00C2A8]" label="وقت التقييم" delay={200} />
                <StatsCounter end={1000} suffix="+" color="text-[#FF7A1A]" label="سيرة ذاتية تم تقييمها" delay={400} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-white/10 bg-[#0B0D12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.p variants={itemVariants} className="text-[#9FB0D3] mb-8">
              موثوق به من فرق صغيرة تتحرك بسرعة
            </motion.p>
            <motion.div variants={itemVariants} className="flex justify-center items-center gap-12 opacity-80">
              {/* CompanyOne */}
              <div className="flex flex-col items-center group hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 mb-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="text-sm font-semibold text-[#9FB0D3] group-hover:text-[#EAF0FF] transition-colors">CompanyOne</div>
              </div>

              {/* ZenWorks */}
              <div className="flex flex-col items-center group hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 mb-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="text-sm font-semibold text-[#9FB0D3] group-hover:text-[#EAF0FF] transition-colors">ZenWorks</div>
              </div>

              {/* BluePeak */}
              <div className="flex flex-col items-center group hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 mb-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="text-sm font-semibold text-[#9FB0D3] group-hover:text-[#EAF0FF] transition-colors">BluePeak</div>
              </div>

              {/* Orbitly */}
              <div className="flex flex-col items-center group hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 mb-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div className="text-sm font-semibold text-[#9FB0D3] group-hover:text-[#EAF0FF] transition-colors">Orbitly</div>
              </div>

              {/* FirmX */}
              <div className="flex flex-col items-center group hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 mb-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <div className="text-sm font-semibold text-[#9FB0D3] group-hover:text-[#EAF0FF] transition-colors">FirmX</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0B0D12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            <motion.div
              variants={itemVariants}
              className="glass-card p-6 hover:scale-[1.01] transition-transform duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#1F48FF]/20 flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-[#1F48FF]" />
                </div>
                <h3 className="text-lg font-semibold">تقييم فوري</h3>
              </div>
              <p className="text-[#9FB0D3]">درجة من 0–100 مع حالة النجاح/الرسوب وأسباب موجزة.</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass-card p-6 hover:scale-[1.01] transition-transform duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00C2A8]/20 flex items-center justify-center">
                  <Funnel className="w-5 h-5 text-[#00C2A8]" />
                </div>
                <h3 className="text-lg font-semibold">مرشحات ذكية</h3>
              </div>
              <p className="text-[#9FB0D3]">رتّب حسب الدرجة أو الخبرة أو المستوى أو القسم فورًا.</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass-card p-6 hover:scale-[1.01] transition-transform duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF7A1A]/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#FF7A1A]" />
                </div>
                <h3 className="text-lg font-semibold">رفع PDF فقط</h3>
              </div>
              <p className="text-[#9FB0D3]">مسار صارم لملفات PDF لضمان قراءة صديقة لـ ATS.</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass-card p-6 hover:scale-[1.01] transition-transform duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#1F48FF]/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#1F48FF]" />
                </div>
                <h3 className="text-lg font-semibold">شفافية كاملة</h3>
              </div>
              <p className="text-[#9FB0D3]">نحفظ نسخة من النص الإرشادي وإصدار النموذج لكل قرار.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#11141B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-bold text-center mb-12">
              كيف يعمل
            </motion.h2>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: "أنشئ وظيفة", desc: "حدّد المهارات والمستوى والخبرة.", icon: Briefcase },
                { title: "المتقدّمون يرفعون PDF", desc: "استلام نظيف ومتسق.", icon: Upload },
                { title: "فحص فوري بالذكاء الاصطناعي", desc: "درجة، نجاح/رسوب، أسباب، عناصر ناقصة.", icon: Cpu },
                { title: "راجع الأفضل", desc: "الإدارة ترتّب وتعاين وتُرشّح.", icon: ListChecks },
              ].map((step, index) => (
                <motion.div key={index} variants={itemVariants} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1F48FF]/20 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-[#1F48FF]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-[#9FB0D3] text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo CTA */}
      <section id="demo" className="py-20 bg-[#0B0D12]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={containerVariants} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-bold mb-4">
              تقدم الآن
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-[#9FB0D3] mb-8">
              ارفع سيرة ذاتية تجريبية وشاهد الترتيب يظهر مباشرة.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/jobs">
                <Button size="lg" className="bg-[#1F48FF] hover:bg-[#0E2CCF] text-white rounded-full px-8 py-3">
                  افتح الوظائف
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#0B0D12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#1F48FF]" />
                <span className="text-xl font-bold">VectorHire</span>
              </div>
              <p className="text-[#9FB0D3] text-sm">نُقيّم السير الذاتية بالذكاء الاصطناعي. قرارات أوضح وتوظيف أسرع.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">المنتج</h4>
              <ul className="space-y-2 text-sm text-[#9FB0D3]">
                <li>
                  <a href="#" className="hover:text-[#EAF0FF] transition-colors">
                    نظرة عامة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#EAF0FF] transition-colors">
                    كيف يعمل
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#EAF0FF] transition-colors">
                    الأمان
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">الشركة</h4>
              <ul className="space-y-2 text-sm text-[#9FB0D3]">
                <li>
                  <a href="#" className="hover:text-[#EAF0FF] transition-colors">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#EAF0FF] transition-colors">
                    الوظائف
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#EAF0FF] transition-colors">
                    تواصل معنا
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">قانوني</h4>
              <ul className="space-y-2 text-sm text-[#9FB0D3]">
                <li>
                  <a href="#" className="hover:text-[#EAF0FF] transition-colors">
                    الخصوصية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#EAF0FF] transition-colors">
                    الشروط
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-[#9FB0D3]">
            <p>&copy; 2024 VectorHire. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}
