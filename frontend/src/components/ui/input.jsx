/**
 * Input Component - Modern & Professional
 */

import { cn } from "@/lib/utils"

export function Input({
  className,
  type = "text",
  ...props
}) {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-500",
        className
      )}
      {...props}
    />
  )
}
