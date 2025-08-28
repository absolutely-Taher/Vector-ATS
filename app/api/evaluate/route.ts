import { type NextRequest, NextResponse } from "next/server"

interface EvaluationResponse {
  ok: boolean
  score: number
  passed: boolean
  reasons: string[]
  missing: string[]
}

interface Application {
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

// Demo evaluation logic - in production this would use actual AI
function evaluateResume(jobDescription: string, fileName: string): EvaluationResponse {
  // Generate a realistic score between 40-99
  const score = Math.floor(Math.random() * 60) + 40

  // Determine pass/fail based on score
  const passed = score >= 70

  // Generate contextual reasons and missing items based on job description
  const reasons = generateReasons(jobDescription, score)
  const missing = generateMissing(jobDescription, score)

  return {
    ok: true,
    score,
    passed,
    reasons,
    missing,
  }
}

function generateReasons(jobDescription: string, score: number): string[] {
  const allReasons = [
    "خبرة تقنية متطابقة مع المتطلبات",
    "مهارات تواصل واضحة في السيرة الذاتية",
    "تنوع في المشاريع والخبرات",
    "تعليم مناسب للمنصب",
    "خبرة عملية ذات صلة",
    "مهارات قيادية واضحة",
    "إتقان الأدوات المطلوبة",
    "خلفية أكاديمية قوية",
    "شهادات مهنية معتمدة",
    "خبرة في بيئة عمل مشابهة",
  ]

  // Higher scores get more reasons
  const numReasons = score >= 85 ? 4 : score >= 70 ? 3 : 2
  return allReasons.slice(0, numReasons)
}

function generateMissing(jobDescription: string, score: number): string[] {
  const allMissing = [
    "شهادات تقنية متخصصة",
    "خبرة في أدوات متقدمة",
    "مهارات قيادية أكثر وضوحاً",
    "خبرة في مشاريع كبيرة الحجم",
    "معرفة بأحدث التقنيات",
    "خبرة دولية أو متعددة الثقافات",
    "مهارات تحليلية متقدمة",
    "خبرة في إدارة الفرق",
    "شهادات أكاديمية إضافية",
    "خبرة في الصناعة المحددة",
  ]

  // Lower scores get more missing items
  const numMissing = score < 60 ? 4 : score < 80 ? 2 : 1
  return allMissing.slice(0, numMissing)
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const jobDescription = formData.get("jobDescription") as string
    const jobId = formData.get("jobId") as string

    if (!file || !jobDescription || !jobId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size too large" }, { status: 400 })
    }

    // Convert PDF to base64 for storage
    const pdfDataUrl = await convertFileToBase64(file)

    // Evaluate the resume using demo logic
    const evaluation = evaluateResume(jobDescription, file.name)

    // Create application record
    const application: Application = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      jobId,
      applicantEmail: "demo@example.com", // In real app, this would come from authenticated user
      applicantName: "متقدم تجريبي",
      jobTitle: getJobTitle(jobId),
      fileName: file.name,
      pdfDataUrl,
      createdAt: Date.now(),
      status: "screened",
      ai: {
        score: evaluation.score,
        passed: evaluation.passed,
        reasons: evaluation.reasons,
        missing: evaluation.missing,
      },
    }

    // Store application (in real app, this would go to database)
    // For demo, we'll return the evaluation and let the client handle storage
    return NextResponse.json({
      ...evaluation,
      applicationId: application.id,
      application,
    })
  } catch (error) {
    console.error("Error evaluating resume:", error)

    // Fallback: return random score if AI fails
    const fallbackScore = Math.floor(Math.random() * 60) + 40
    return NextResponse.json({
      ok: true,
      score: fallbackScore,
      passed: fallbackScore >= 70,
      reasons: ["تقييم أساسي للسيرة الذاتية"],
      missing: ["يحتاج مراجعة يدوية"],
      error: "AI evaluation failed, using fallback",
    })
  }
}

function getJobTitle(jobId: string): string {
  const jobTitles: Record<string, string> = {
    "1": "مهندس واجهات أمامية",
    "2": "محاسب",
    "3": "مسؤول إداري",
    "4": "فني صيانة",
  }
  return jobTitles[jobId] || "وظيفة غير محددة"
}
