"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Sparkles,
  LogOut,
  Filter,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  CheckCircle,
  XCircle,
  Maximize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { ScoreBadge } from "@/components/ui/score-badge"
import { PassedPill } from "@/components/ui/passed-pill"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { toast } from "sonner"
import { ApplicationService, type Application } from "@/lib/applications"

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

function DashboardContent() {
  const { user, logout } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isPdfMaximized, setIsPdfMaximized] = useState(false)
  const [sortField, setSortField] = useState<"score" | "createdAt" | "applicantEmail" | "jobTitle">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<"الكل" | "ناجح" | "راسب">("الكل")

  useEffect(() => {
    const loadApplications = () => {
      const apps = ApplicationService.getApplications()
      setApplications(apps)
    }

    loadApplications()

    const handleStorageChange = () => {
      loadApplications()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications

    if (filterStatus !== "الكل") {
      filtered = filtered.filter((app) => (filterStatus === "ناجح" ? app.ai.passed : !app.ai.passed))
    }

    return filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Application]
      let bValue: any = b[sortField as keyof Application]

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortField === "score") {
        aValue = a.ai.score
        bValue = b.ai.score
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [applications, sortField, sortDirection, filterStatus])

  const handleSort = (field: "score" | "createdAt" | "applicantEmail" | "jobTitle") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application)
    setIsDrawerOpen(true)
  }

  const handleShortlist = (applicationId: string) => {
    ApplicationService.updateApplication(applicationId, { status: "screened" })
    toast.success("تم ترشيح المتقدم بنجاح")
    setIsDrawerOpen(false)
    setApplications(ApplicationService.getApplications())
  }

  const handleReject = (applicationId: string) => {
    ApplicationService.updateApplication(applicationId, { status: "screened" })
    toast.success("تم رفض المتقدم")
    setIsDrawerOpen(false)
    setApplications(ApplicationService.getApplications())
  }

  const getSortIcon = (field: "score" | "createdAt" | "applicantEmail" | "jobTitle") => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
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

            <div className="flex items-center gap-4">
              <span className="text-sm text-[#9FB0D3]">مرحباً، {user?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-white/20 text-[#9FB0D3] hover:bg-white/5 bg-transparent"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">لوحة الإدارة</h1>
          <p className="text-[#9FB0D3]">راجع وقيّم طلبات التوظيف</p>
        </div>

        <Card className="glass-card mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#1F48FF]" />
              <CardTitle className="text-lg">المرشحات</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {(["الكل", "ناجح", "راسب"] as ("الكل" | "ناجح" | "راسب")[]).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={
                    filterStatus === status
                      ? "bg-[#1F48FF] hover:bg-[#0E2CCF] text-white"
                      : "border-white/20 text-[#9FB0D3] hover:bg-white/5 bg-transparent"
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-0">
            {filteredAndSortedApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#9FB0D3]/10 flex items-center justify-center">
                  <Filter className="w-8 h-8 text-[#9FB0D3]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد طلبات حتى الآن.</h3>
                <p className="text-[#9FB0D3] text-sm">ستظهر طلبات التوظيف هنا عند وصولها</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-[#11141B]/95 backdrop-blur-sm">
                    <TableRow className="border-white/10">
                      <TableHead
                        className="text-right cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => handleSort("applicantEmail")}
                      >
                        <div className="flex items-center justify-end gap-2">
                          المتقدّم
                          {getSortIcon("applicantEmail")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => handleSort("jobTitle")}
                      >
                        <div className="flex items-center justify-end gap-2">
                          الوظيفة
                          {getSortIcon("jobTitle")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => handleSort("score")}
                      >
                        <div className="flex items-center justify-end gap-2">
                          الدرجة
                          {getSortIcon("score")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead
                        className="text-right cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center justify-end gap-2">
                          التاريخ
                          {getSortIcon("createdAt")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedApplications.map((application) => (
                      <TableRow key={application.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-right">
                          <div>
                            <div className="font-medium">{application.applicantName}</div>
                            <div className="text-sm text-[#9FB0D3]">{application.applicantEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{application.jobTitle}</TableCell>
                        <TableCell className="text-right">
                          <ScoreBadge score={application.ai.score} size="sm" />
                        </TableCell>
                        <TableCell className="text-right">
                          <PassedPill passed={application.ai.passed} />
                        </TableCell>
                        <TableCell className="text-right text-[#9FB0D3]">
                          {new Date(application.createdAt).toLocaleDateString("ar-SA")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#11141B] border-white/10">
                              <DropdownMenuItem
                                onClick={() => handleViewApplication(application)}
                                className="text-right hover:bg-white/5"
                              >
                                <Eye className="w-4 h-4 ml-2" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="left" className="w-full sm:max-w-6xl bg-[#11141B] border-white/10 p-0">
          <div className="flex h-full">
            <div className="flex-1 p-6 border-l border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">معاينة السيرة الذاتية</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsPdfMaximized(true)} className="h-8 w-8 p-0">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsDrawerOpen(false)} className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 h-[80vh] overflow-y-auto">
                <div className="bg-white text-gray-900 rounded-lg p-6 h-full overflow-y-auto">
                  <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 border-b border-gray-300 pb-6">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">أحمد محمد علي</h1>
                      <p className="text-xl text-gray-600 mb-2">مهندس واجهات أمامية - Frontend Engineer</p>
                      <div className="flex justify-center gap-6 text-sm text-gray-600">
                        <span>📧 ahmed.mohamed@email.com</span>
                        <span>📱 +966 50 123 4567</span>
                        <span>📍 الرياض، المملكة العربية السعودية</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">الملخص المهني</h2>
                      <p className="text-gray-700 leading-relaxed">
                        مهندس واجهات أمامية ذو خبرة 5 سنوات في تطوير تطبيقات الويب الحديثة باستخدام React و TypeScript. 
                        متخصص في بناء واجهات مستخدم تفاعلية ومتجاوبة مع التركيز على الأداء وتجربة المستخدم المثلى. 
                        خبرة قوية في العمل مع فرق متعددة التخصصات وتطبيق أفضل الممارسات في تطوير البرمجيات.
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">المهارات التقنية</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">لغات البرمجة</h3>
                          <ul className="text-gray-700 space-y-1">
                            <li>• JavaScript (ES6+)</li>
                            <li>• TypeScript</li>
                            <li>• HTML5 & CSS3</li>
                            <li>• Python (أساسيات)</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">أطر العمل والمكتبات</h3>
                          <ul className="text-gray-700 space-y-1">
                            <li>• React.js & React Hooks</li>
                            <li>• Next.js</li>
                            <li>• Tailwind CSS</li>
                            <li>• Material-UI</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">الخبرة المهنية</h2>
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">مهندس واجهات أمامية أول</h3>
                          <span className="text-gray-600">2022 - الحالي</span>
                        </div>
                        <p className="text-gray-700 font-medium mb-2">شركة التقنية المتقدمة - الرياض</p>
                        <ul className="text-gray-700 space-y-1">
                          <li>• قيادة تطوير واجهات المستخدم لـ 3 تطبيقات رئيسية باستخدام React و TypeScript</li>
                          <li>• تحسين أداء التطبيقات بنسبة 40% من خلال تحسين الكود وتحسين التحميل</li>
                          <li>• تدريب وتوجيه 4 مطورين مبتدئين في فريق الواجهات الأمامية</li>
                          <li>• تطبيق معايير التصميم المتجاوب لضمان التوافق مع جميع الأجهزة</li>
                        </ul>
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">مطور واجهات أمامية</h3>
                          <span className="text-gray-600">2020 - 2022</span>
                        </div>
                        <p className="text-gray-700 font-medium mb-2">استوديو الويب الإبداعي - جدة</p>
                        <ul className="text-gray-700 space-y-1">
                          <li>• تطوير واجهات مستخدم لـ 15+ موقع إلكتروني باستخدام React و Next.js</li>
                          <li>• التعاون مع مصممي UX/UI لتحويل التصاميم إلى كود تفاعلي</li>
                          <li>• تطبيق مبادئ التصميم المتجاوب والوصول الشامل</li>
                          <li>• المشاركة في مراجعات الكود وتحسين جودة البرمجيات</li>
                        </ul>
                      </div>
                    </div>

                    {/* Education */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">التعليم</h2>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">بكالوريوس علوم الحاسب الآلي</h3>
                        <span className="text-gray-600">2016 - 2020</span>
                      </div>
                      <p className="text-gray-700">جامعة الملك فهد للبترول والمعادن - الظهران</p>
                      <p className="text-gray-600 text-sm">المعدل التراكمي: 3.8/4.0</p>
                    </div>

                    {/* Projects */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">المشاريع المميزة</h2>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">منصة إدارة المهام - TaskFlow</h3>
                        <p className="text-gray-700 mb-2">
                          تطبيق ويب شامل لإدارة المشاريع والمهام باستخدام React و Node.js. 
                          يتضمن ميزات مثل إدارة الفرق، تتبع الوقت، والتقارير التفصيلية.
                        </p>
                        <div className="flex gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">React</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">TypeScript</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Node.js</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">متجر إلكتروني - TechStore</h3>
                        <p className="text-gray-700 mb-2">
                          منصة تجارة إلكترونية متكاملة مع نظام إدارة المحتوى، 
                          نظام دفع آمن، وتجربة مستخدم محسنة للهواتف المحمولة.
                        </p>
                        <div className="flex gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Next.js</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Stripe</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Tailwind CSS</span>
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">الشهادات</h2>
                      <ul className="text-gray-700 space-y-2">
                        <li>• شهادة React Developer - Meta (2023)</li>
                        <li>• شهادة TypeScript Fundamentals - Microsoft (2022)</li>
                        <li>• شهادة Web Accessibility - W3C (2021)</li>
                        <li>• شهادة AWS Cloud Practitioner (2020)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-80 p-6 overflow-y-auto max-h-full">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-right">حُكم الذكاء الاصطناعي</SheetTitle>
              </SheetHeader>

              {selectedApplication && (
                <div className="space-y-6">
                  <div className="text-center">
                    <ScoreBadge score={selectedApplication.ai.score} size="lg" className="mx-auto mb-3" />
                    <PassedPill passed={selectedApplication.ai.passed} className="text-base px-4 py-2" />
                  </div>

                  <div className="glass p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">{selectedApplication.applicantName}</h4>
                    <p className="text-sm text-[#9FB0D3] mb-1">{selectedApplication.applicantEmail}</p>
                    <p className="text-sm text-[#9FB0D3]">{selectedApplication.jobTitle}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      نقاط القوة
                    </h4>
                    <ul className="space-y-2">
                      {selectedApplication.ai.reasons.map((reason: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-[#9FB0D3]">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400" />
                      نقاط التحسين
                    </h4>
                    <ul className="space-y-2">
                      {selectedApplication.ai.missing.map((missing: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-[#9FB0D3]">{missing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleShortlist(selectedApplication.id)}
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      ترشيح
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-500/40 text-red-400 hover:bg-red-500/10 bg-transparent"
                      onClick={() => handleReject(selectedApplication.id)}
                    >
                      <XCircle className="w-4 h-4 ml-2" />
                      رفض
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isPdfMaximized} onOpenChange={setIsPdfMaximized}>
        <DialogContent className="max-w-none w-screen h-screen bg-[#11141B] border-white/10 p-0 rounded-none">
          <VisuallyHidden asChild>
            <DialogTitle>معاينة السيرة الذاتية - عرض مكبر</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold">معاينة السيرة الذاتية - عرض مكبر</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsPdfMaximized(false)} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 p-4 h-[calc(100vh-80px)]">
            <div className="bg-white text-gray-900 rounded-lg p-6 h-full overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 border-b border-gray-300 pb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">أحمد محمد علي</h1>
                  <p className="text-xl text-gray-600 mb-2">مهندس واجهات أمامية - Frontend Engineer</p>
                  <div className="flex justify-center gap-6 text-sm text-gray-600">
                    <span>📧 ahmed.mohamed@email.com</span>
                    <span>📱 +966 50 123 4567</span>
                    <span>📍 الرياض، المملكة العربية السعودية</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">الملخص المهني</h2>
                  <p className="text-gray-700 leading-relaxed">
                    مهندس واجهات أمامية ذو خبرة 5 سنوات في تطوير تطبيقات الويب الحديثة باستخدام React و TypeScript. 
                    متخصص في بناء واجهات مستخدم تفاعلية ومتجاوبة مع التركيز على الأداء وتجربة المستخدم المثلى. 
                    خبرة قوية في العمل مع فرق متعددة التخصصات وتطبيق أفضل الممارسات في تطوير البرمجيات.
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">المهارات التقنية</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">لغات البرمجة</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li>• JavaScript (ES6+)</li>
                        <li>• TypeScript</li>
                        <li>• HTML5 & CSS3</li>
                        <li>• Python (أساسيات)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">أطر العمل والمكتبات</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li>• React.js & React Hooks</li>
                        <li>• Next.js</li>
                        <li>• Tailwind CSS</li>
                        <li>• Material-UI</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">الخبرة المهنية</h2>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">مهندس واجهات أمامية أول</h3>
                      <span className="text-gray-600">2022 - الحالي</span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">شركة التقنية المتقدمة - الرياض</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• قيادة تطوير واجهات المستخدم لـ 3 تطبيقات رئيسية باستخدام React و TypeScript</li>
                      <li>• تحسين أداء التطبيقات بنسبة 40% من خلال تحسين الكود وتحسين التحميل</li>
                      <li>• تدريب وتوجيه 4 مطورين مبتدئين في فريق الواجهات الأمامية</li>
                      <li>• تطبيق معايير التصميم المتجاوب لضمان التوافق مع جميع الأجهزة</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">مطور واجهات أمامية</h3>
                      <span className="text-gray-600">2020 - 2022</span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">استوديو الويب الإبداعي - جدة</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• تطوير واجهات مستخدم لـ 15+ موقع إلكتروني باستخدام React و Next.js</li>
                      <li>• التعاون مع مصممي UX/UI لتحويل التصاميم إلى كود تفاعلي</li>
                      <li>• تطبيق مبادئ التصميم المتجاوب والوصول الشامل</li>
                      <li>• المشاركة في مراجعات الكود وتحسين جودة البرمجيات</li>
                    </ul>
                  </div>
                </div>

                {/* Education */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">التعليم</h2>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">بكالوريوس علوم الحاسب الآلي</h3>
                    <span className="text-gray-600">2016 - 2020</span>
                  </div>
                  <p className="text-gray-700">جامعة الملك فهد للبترول والمعادن - الظهران</p>
                  <p className="text-gray-600 text-sm">المعدل التراكمي: 3.8/4.0</p>
                </div>

                {/* Projects */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">المشاريع المميزة</h2>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">منصة إدارة المهام - TaskFlow</h3>
                    <p className="text-gray-700 mb-2">
                      تطبيق ويب شامل لإدارة المشاريع والمهام باستخدام React و Node.js. 
                      يتضمن ميزات مثل إدارة الفرق، تتبع الوقت، والتقارير التفصيلية.
                    </p>
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">React</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">TypeScript</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Node.js</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">متجر إلكتروني - TechStore</h3>
                    <p className="text-gray-700 mb-2">
                      منصة تجارة إلكترونية متكاملة مع نظام إدارة المحتوى، 
                      نظام دفع آمن، وتجربة مستخدم محسنة للهواتف المحمولة.
                    </p>
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Next.js</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Stripe</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Tailwind CSS</span>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">الشهادات</h2>
                  <ul className="text-gray-700 space-y-2">
                    <li>• شهادة React Developer - Meta (2023)</li>
                    <li>• شهادة TypeScript Fundamentals - Microsoft (2022)</li>
                    <li>• شهادة Web Accessibility - W3C (2021)</li>
                    <li>• شهادة AWS Cloud Practitioner (2020)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard requireRole="admin">
      <DashboardContent />
    </AuthGuard>
  )
}
