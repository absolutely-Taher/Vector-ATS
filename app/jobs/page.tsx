"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Filter, MapPin, Clock, Users, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"
import { ApplicationService } from "@/lib/applications"

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
      type: "spring",
      stiffness: 160,
      damping: 20,
    },
  },
}

// Seed data for jobs
const seedJobs = [
  {
    id: "1",
    title: "مهندس واجهات أمامية",
    dept: "tech",
    level: "junior",
    minYears: 0,
    description: "React/TS وأنظمة واجهات. نبحث عن مطور شغوف بالتقنيات الحديثة.",
    isOpen: true,
  },
  {
    id: "2",
    title: "محاسب",
    dept: "accounting",
    level: "mid",
    minYears: 2,
    description: "حسابات عملاء/موردين وإقفالات، Excel. خبرة في الأنظمة المحاسبية.",
    isOpen: true,
  },
  {
    id: "3",
    title: "مسؤول إداري",
    dept: "admin",
    level: "fresh",
    minYears: 0,
    description: "الجدولة والدعم التشغيلي. مهارات تنظيمية وتواصل ممتازة.",
    isOpen: true,
  },
  {
    id: "4",
    title: "فني صيانة",
    dept: "labor",
    level: "junior",
    minYears: 0,
    description: "إصلاحات أساسية وسلامة. معرفة بأدوات الصيانة الأساسية.",
    isOpen: true,
  },
]

const deptLabels = {
  tech: "تقنية",
  admin: "إدارية",
  accounting: "محاسبة",
  labor: "عمالة",
}

const levelLabels = {
  fresh: "خريج جديد",
  junior: "مبتدئ",
  mid: "متوسط",
  senior: "خبير",
}

export default function JobsPage() {
  const [selectedDept, setSelectedDept] = useState<string>("الكل")
  const [selectedLevel, setSelectedLevel] = useState<string>("الكل")
  const [experienceRange, setExperienceRange] = useState([0])
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    ApplicationService.seedDemoData()
  }, [])

  const filteredJobs = useMemo(() => {
    return seedJobs.filter((job) => {
      const deptMatch = selectedDept === "الكل" || job.dept === selectedDept
      const levelMatch = selectedLevel === "الكل" || job.level === selectedLevel
      const experienceMatch = job.minYears <= experienceRange[0]
      return deptMatch && levelMatch && experienceMatch && job.isOpen
    })
  }, [selectedDept, selectedLevel, experienceRange])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("يُرجى رفع ملف PDF فقط")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("حجم الملف كبير جداً (الحد الأقصى 10 ميجابايت)")
        return
      }
      setUploadedFile(file)
    }
  }

  const handleSubmitApplication = async () => {
    if (!uploadedFile || !selectedJob || isSubmitting) return

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("file", uploadedFile)
    formData.append("jobDescription", selectedJob.description)
    formData.append("jobId", selectedJob.id)

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.ok) {
        if (result.application) {
          ApplicationService.addApplication(result.application)
        }

        toast.success("تم إرسال طلبك بنجاح! سيتم مراجعته من قبل المختصين في التوظيف.")
        setIsApplyModalOpen(false)
        setUploadedFile(null)
        setSelectedJob(null)
      } else {
        toast.error(result.error || "حدث خطأ أثناء إرسال الطلب")
      }
    } catch (error) {
      console.error("Application submission error:", error)
      toast.error("حدث خطأ أثناء إرسال الطلب")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen bg-[#0B0D12] text-[#EAF0FF]"
    >
      <nav className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#1F48FF]" />
              <span className="text-xl font-bold">VectorHire</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-[#9FB0D3] hover:text-[#EAF0FF] transition-colors">
                الرئيسية
              </Link>
              <Link href="/jobs" className="text-[#EAF0FF] font-medium">
                الوظائف
              </Link>
              <Link href="/login" className="text-[#9FB0D3] hover:text-[#EAF0FF] transition-colors">
                الإدارة
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={containerVariants} initial="initial" animate="animate" className="mb-8">
          <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2">
            الوظائف المتاحة
          </motion.h1>
          <motion.p variants={itemVariants} className="text-[#9FB0D3]">
            اختر الوظيفة المناسبة وقدّم طلبك الآن
          </motion.p>
        </motion.div>

        <motion.div variants={containerVariants} initial="initial" animate="animate" className="glass-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#1F48FF]" />
            <h2 className="text-lg font-semibold">المرشحات</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Label className="text-sm font-medium mb-2 block">القسم</Label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="bg-[#11141B] border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">الكل</SelectItem>
                  <SelectItem value="tech">تقنية</SelectItem>
                  <SelectItem value="admin">إدارية</SelectItem>
                  <SelectItem value="accounting">محاسبة</SelectItem>
                  <SelectItem value="labor">عمالة</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label className="text-sm font-medium mb-2 block">المستوى</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-[#11141B] border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">الكل</SelectItem>
                  <SelectItem value="fresh">خريج جديد</SelectItem>
                  <SelectItem value="junior">مبتدئ</SelectItem>
                  <SelectItem value="mid">متوسط</SelectItem>
                  <SelectItem value="senior">خبير</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label className="text-sm font-medium mb-2 block">سنوات الخبرة (حتى {experienceRange[0]})</Label>
              <Slider
                value={experienceRange}
                onValueChange={setExperienceRange}
                max={10}
                min={0}
                step={1}
                className="mt-2"
              />
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedDept !== "الكل" && (
              <Badge variant="secondary" className="bg-[#1F48FF]/20 text-[#1F48FF] border-[#1F48FF]/40">
                القسم:{" "}
                {selectedDept === "tech"
                  ? "تقنية"
                  : selectedDept === "admin"
                    ? "إدارية"
                    : selectedDept === "accounting"
                      ? "محاسبة"
                      : "عمالة"}
              </Badge>
            )}
            {selectedLevel !== "الكل" && (
              <Badge variant="secondary" className="bg-[#00C2A8]/20 text-[#00C2A8] border-[#00C2A8]/40">
                المستوى: {levelLabels[selectedLevel as keyof typeof levelLabels]}
              </Badge>
            )}
            {experienceRange[0] > 0 && (
              <Badge variant="secondary" className="bg-[#FF7A1A]/20 text-[#FF7A1A] border-[#FF7A1A]/40">
                الخبرة: حتى {experienceRange[0]} سنوات
              </Badge>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredJobs.map((job) => (
            <motion.div key={job.id} variants={itemVariants}>
              <Card className="glass-card hover:scale-[1.01] transition-all duration-200 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-balance">{job.title}</CardTitle>
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/40">مفتوحة</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-white/20 text-[#9FB0D3]">
                      <MapPin className="w-3 h-3 ml-1" />
                      {deptLabels[job.dept as keyof typeof deptLabels]}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-[#9FB0D3]">
                      <Users className="w-3 h-3 ml-1" />
                      {levelLabels[job.level as keyof typeof levelLabels]}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-[#9FB0D3]">
                      <Clock className="w-3 h-3 ml-1" />
                      {job.minYears} سنوات خبرة
                    </Badge>
                  </div>

                  <p className="text-[#9FB0D3] text-sm leading-relaxed">{job.description}</p>

                  <Dialog
                    open={isApplyModalOpen && selectedJob?.id === job.id}
                    onOpenChange={(open) => {
                      setIsApplyModalOpen(open)
                      if (!open) {
                        setSelectedJob(null)
                        setUploadedFile(null)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-[#1F48FF] hover:bg-[#0E2CCF] text-white rounded-lg"
                        onClick={() => setSelectedJob(job)}
                      >
                        قدّم الآن
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#11141B] border-white/10 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-right">التقديم عبر PDF</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">ارفع سيرتك الذاتية (PDF فقط)</Label>
                          <div className="glass border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#1F48FF]/50 transition-colors">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-[#9FB0D3]" />
                            <p className="text-sm text-[#9FB0D3] mb-2">اسحب الملف هنا أو انقر للاختيار</p>
                            <Input
                              type="file"
                              accept="application/pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="pdf-upload"
                            />
                            <Label
                              htmlFor="pdf-upload"
                              className="cursor-pointer text-[#1F48FF] hover:text-[#0E2CCF] text-sm"
                            >
                              اختر ملف PDF
                            </Label>
                          </div>

                          {uploadedFile && (
                            <div className="mt-3 p-3 bg-[#1F48FF]/10 rounded-lg border border-[#1F48FF]/20">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#1F48FF]/20 rounded flex items-center justify-center">
                                  <Upload className="w-4 h-4 text-[#1F48FF]" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                                  <p className="text-xs text-[#9FB0D3]">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} ميجابايت
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-[#FF7A1A]/10 border border-[#FF7A1A]/20 rounded-lg p-3">
                          <p className="text-xs text-[#FF7A1A]">نقبل ملفات PDF فقط لضمان قراءة متوافقة مع ATS.</p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 border-white/20 text-[#9FB0D3] hover:bg-white/5 bg-transparent"
                            onClick={() => {
                              setIsApplyModalOpen(false)
                              setSelectedJob(null)
                              setUploadedFile(null)
                            }}
                            disabled={isSubmitting}
                          >
                            إلغاء
                          </Button>
                          <Button
                            className="flex-1 bg-[#1F48FF] hover:bg-[#0E2CCF] text-white"
                            onClick={handleSubmitApplication}
                            disabled={!uploadedFile || isSubmitting}
                          >
                            {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredJobs.length === 0 && (
          <motion.div variants={itemVariants} initial="initial" animate="animate" className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#9FB0D3]/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-[#9FB0D3]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">لا توجد وظائف متاحة</h3>
              <p className="text-[#9FB0D3] text-sm">جرّب تعديل المرشحات للعثور على وظائف أخرى</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
