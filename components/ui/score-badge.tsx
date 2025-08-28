import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ScoreBadge({ score, size = "md", className }: ScoreBadgeProps) {
  const sizes = {
    sm: "w-9 h-9 text-xs",
    md: "w-14 h-14 text-sm",
    lg: "w-18 h-18 text-base",
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-400"
    if (score >= 60) return "from-yellow-500 to-orange-400"
    return "from-red-500 to-rose-400"
  }

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-bold",
        "bg-gradient-to-br",
        getScoreColor(score),
        sizes[size],
        className,
      )}
    >
      <div className="absolute inset-0.5 rounded-full bg-background flex items-center justify-center">
        <span className="text-foreground">{score}</span>
      </div>
    </div>
  )
}
