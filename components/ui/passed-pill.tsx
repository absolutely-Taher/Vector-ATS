import { cn } from "@/lib/utils"

interface PassedPillProps {
  passed: boolean
  className?: string
}

export function PassedPill({ passed, className }: PassedPillProps) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium border",
        passed
          ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/40"
          : "bg-red-600/15 text-red-400 border-red-500/40",
        className,
      )}
    >
      {passed ? "ناجح" : "راسب"}
    </span>
  )
}
