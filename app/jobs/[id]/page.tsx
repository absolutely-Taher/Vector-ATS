"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, MapPin, Clock, Users, Upload, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"
import { useParams } from "next/navigation"

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

// Mock job data - in real app this would come from API
const getJobById = (id: string) => {
  const jobs = {
    "1": {
      id: "1",
      title: "مهندس واجهات أمامية",
      dept: "tech",
      level: "junior",
      minYears: 0,
      description: "React/TS وأنظمة واجهات. نبحث عن مطور شغوف بالتقنيات الحديثة.",
      requirements: [
        "خبرة في React و TypeScript",
        "معرفة بـ HTML5, CSS3, JavaScript",
        "فهم أساسيات Git",
        "مهارات تواصل جيدة",
      ],
      responsibilities: [
        "تطوير واجهات المستخدم التفاعلية",
        "التعاون مع فريق التصميم",
        "كتابة كود نظيف وقابل للصيانة",
        "اختبار وتحسين الأداء",
      ],
      isOpen: true,
      postedDate: "2024-01-15",
    },
    "2": {
      id: "2",
      title: "محاسب",
      dept: "accounting",
      level: "mid",
      minYears: 2,
      description: "حسابات عملاء/موردين وإقفالات، Excel. خبرة في الأنظمة المحاسبية.",
      requirements: [
        "شهادة في المحاسبة أو المالية",
        "خبرة سنتين على الأقل",
        "إتقان Excel المتقدم",
        "معرفة بالأنظمة المحاسبية",
      ],
      responsibilities: [
        "إدارة حسابات العملاء والموردين",
        "إعداد التقارير المالية",
        "المراجعة والإقفالات الشهرية",
        "التأكد من دقة البيانات المالية",
      ],
      isOpen: true,
      postedDate: "2024-01-10",
    },
  }
  return jobs[id as keyof typeof jobs]
}

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

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string
  const job = getJobById(jobId)

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-[#EAF0FF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">الوظيفة غير موجودة</h1>
          <Link href="/jobs">
            <Button className="bg-[#1F48FF] hover:bg-[#0E2CCF] text-white">العودة للوظائف</Button>
          </Link>
        </div>
      </div>
    )
  }

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
    if (!uploadedFile) return

    const formData = new FormData()
    formData.append("file", uploadedFile)
    formData.append("jobDescription", job.description)
    formData.append("jobId", job.id)

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast.success("تم إرسال طلبك بنجاح! سيتم مراجعته من قبل المختصين في التوظيف.")
        setIsApplyModalOpen(false)
        setUploadedFile(null)
      } else {
        toast.error("حدث خطأ أثناء إرسال الطلب")
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب")
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
      {/* Navigation */}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#9FB0D3] mb-6">
          <Link href="/jobs" className="hover:text-[#EAF0FF] transition-colors">
            الوظائف
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-[#EAF0FF]">{job.title}</span>
        </div>

        {/* Job Header */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold mb-2 text-balance">{job.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
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
                  <Badge variant="outline" className="border-white/20 text-[#9FB0D3]">
                    <Calendar className="w-3 h-3 ml-1" />
                    {new Date(job.postedDate).toLocaleDateString("ar-SA")}
                  </Badge>
                </div>
              </div>
              <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/40">مفتوحة</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[#9FB0D3] leading-relaxed mb-6">{job.description}</p>

            <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1F48FF] hover:bg-[#0E2CCF] text-white rounded-lg px-8">قدّم الآن</Button>
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
                        setUploadedFile(null)
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button
                      className="flex-1 bg-[#1F48FF] hover:bg-[#0E2CCF] text-white"
                      onClick={handleSubmitApplication}
                      disabled={!uploadedFile}
                    >
                      إرسال الطلب
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Job Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">المتطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements?.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-[#9FB0D3]">
                    <div className="w-1.5 h-1.5 bg-[#1F48FF] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">المسؤوليات</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.responsibilities?.map((resp, index) => (
                  <li key={index} className="flex items-start gap-2 text-[#9FB0D3]">
                    <div className="w-1.5 h-1.5 bg-[#00C2A8] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{resp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
