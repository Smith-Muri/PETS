/**
 * Button Component - Modern & Professional
 */

import { cn } from "@/lib/utils"

const buttonVariants = {
  default: "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg font-medium",
  outline: "border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium",
  secondary: "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-md hover:shadow-lg font-medium",
  destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg font-medium",
  ghost: "text-slate-700 hover:bg-slate-100",
}

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-lg",
  lg: "px-6 py-3 text-lg rounded-lg",
  xl: "px-8 py-4 text-lg rounded-xl",
}

export function Button({
  className,
  variant = "default",
  size = "md",
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        "font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    />
  )
}
