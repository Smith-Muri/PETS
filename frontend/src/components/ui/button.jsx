/**
 * Button Component - Modern & Professional
 */

import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow",
        outline: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
        secondary: "bg-slate-700 text-white hover:bg-slate-800 shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export function Button({ className, variant, size, disabled, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      {...props}
    />
  )
}
