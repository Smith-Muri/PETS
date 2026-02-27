/**
 * Card Component - Modern & Professional
 */

import { cn } from "@/lib/utils"

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div className={cn("flex items-center gap-4 p-6 border-b border-slate-100", className)} {...props} />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <h2 className={cn("text-xl md:text-2xl font-semibold tracking-tight text-slate-900", className)} {...props} />
  )
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-slate-600", className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 p-4 md:p-6 border-t border-slate-100 bg-slate-50", className)} {...props} />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
