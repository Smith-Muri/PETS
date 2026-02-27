import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputStyles = cva(
  "w-full rounded-lg bg-white border px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-150 focus:outline-none",
  {
    variants: {
      intent: {
        default: "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100",
        error: "border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-100",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
)

export function Input({ className, type = "text", intent, ...props }) {
  return (
    <input
      type={type}
      className={cn(inputStyles({ intent }), className)}
      {...props}
    />
  )
}
