import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export function Dialog({ open, onClose, children, className }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden transform transition-all duration-200 scale-100',
          className
        )}
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default Dialog
