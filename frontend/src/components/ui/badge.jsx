import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-slate-100 text-slate-800",
      success: "bg-emerald-50 text-emerald-700",
      danger: "bg-red-50 text-red-700",
      muted: "bg-slate-50 text-slate-500",
    },
    size: {
      sm: "px-2 py-0.5 text-[11px]",
      md: "px-3 py-1 text-xs",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

export function Badge({ children, variant, size, className, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  )
}

export default Badge
