import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  // Primera página
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('...');
  }

  // Páginas intermedias
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Última página
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 my-12">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 px-3 gap-1 rounded-lg border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50"
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-2">
        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={idx} className="px-2 text-slate-400 font-medium">
              ...
            </span>
          ) : (
            <Button
              key={idx}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 rounded-lg font-semibold transition-all ${
                page === currentPage
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                  : 'border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {page}
            </Button>
          )
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 px-3 gap-1 rounded-lg border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={18} />
      </Button>

      {/* Page Info */}
      <p className="text-sm text-slate-600 font-medium ml-4 hidden sm:block">
        Página <span className="text-indigo-600 font-bold">{currentPage}</span> de <span className="text-indigo-600 font-bold">{totalPages}</span>
      </p>
    </div>
  );
}

