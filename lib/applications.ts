export interface Application {
  id: string
  jobId: string
  applicantEmail: string
  applicantName: string
  jobTitle: string
  fileName: string
  pdfDataUrl: string
  createdAt: number
  status: "received" | "screened"
  ai: {
    score: number
    passed: boolean
    reasons: string[]
    missing: string[]
  }
}

export class ApplicationService {
  private static readonly STORAGE_KEY = "vectorhire_applications"

  static getApplications(): Application[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static addApplication(application: Application): void {
    if (typeof window === "undefined") return

    const applications = this.getApplications()
    applications.push(application)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications))
  }

  static updateApplication(id: string, updates: Partial<Application>): void {
    if (typeof window === "undefined") return

    const applications = this.getApplications()
    const index = applications.findIndex((app) => app.id === id)

    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications))
    }
  }

  static deleteApplication(id: string): void {
    if (typeof window === "undefined") return

    const applications = this.getApplications().filter((app) => app.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications))
  }

  static getApplicationsByJob(jobId: string): Application[] {
    return this.getApplications().filter((app) => app.jobId === jobId)
  }

  static seedDemoData(): void {
    if (typeof window === "undefined") return

    // Only seed if no applications exist
    const existing = this.getApplications()
    if (existing.length > 0) return

    const demoApplications: Application[] = [
      {
        id: "app-1",
        jobId: "1",
        applicantEmail: "ahmed.mohamed@email.com",
        applicantName: "أحمد محمد",
        jobTitle: "مهندس واجهات أمامية",
        fileName: "ahmed_cv.pdf",
        pdfDataUrl: "data:application/pdf;base64,demo-data",
        createdAt: Date.now() - 86400000, // 1 day ago
        status: "screened",
        ai: {
          score: 92,
          passed: true,
          reasons: [
            "خبرة قوية في React و TypeScript",
            "مشاريع متنوعة في الواجهات الأمامية",
            "مهارات تقنية متطابقة مع المتطلبات",
          ],
          missing: ["شهادات تقنية معتمدة"],
        },
      },
      {
        id: "app-2",
        jobId: "2",
        applicantEmail: "fatima.ali@email.com",
        applicantName: "فاطمة علي",
        jobTitle: "محاسب",
        fileName: "fatima_resume.pdf",
        pdfDataUrl: "data:application/pdf;base64,demo-data",
        createdAt: Date.now() - 172800000, // 2 days ago
        status: "screened",
        ai: {
          score: 67,
          passed: false,
          reasons: ["خبرة محاسبية أساسية", "معرفة بـ Excel"],
          missing: ["خبرة في الأنظمة المحاسبية المتقدمة", "شهادة CPA أو ما يعادلها", "خبرة في الإقفالات الشهرية"],
        },
      },
      {
        id: "app-3",
        jobId: "3",
        applicantEmail: "khalid.ahmed@email.com",
        applicantName: "خالد أحمد",
        jobTitle: "مسؤول إداري",
        fileName: "khalid_cv.pdf",
        pdfDataUrl: "data:application/pdf;base64,demo-data",
        createdAt: Date.now() - 259200000, // 3 days ago
        status: "screened",
        ai: {
          score: 85,
          passed: true,
          reasons: ["مهارات تنظيمية ممتازة", "خبرة في الدعم الإداري", "مهارات تواصل قوية"],
          missing: ["خبرة في أنظمة إدارة المكاتب الحديثة"],
        },
      },
      {
        id: "app-4",
        jobId: "4",
        applicantEmail: "mariam.hassan@email.com",
        applicantName: "مريم حسن",
        jobTitle: "فني صيانة",
        fileName: "mariam_resume.pdf",
        pdfDataUrl: "data:application/pdf;base64,demo-data",
        createdAt: Date.now() - 345600000, // 4 days ago
        status: "screened",
        ai: {
          score: 74,
          passed: true,
          reasons: ["خبرة عملية في الصيانة", "معرفة بأدوات السلامة"],
          missing: ["شهادات تقنية متخصصة", "خبرة في الصيانة الوقائية"],
        },
      },
    ]

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoApplications))
  }
}
