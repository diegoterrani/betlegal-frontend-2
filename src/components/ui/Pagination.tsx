import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-[#D7DEE8] dark:border-[#263548] text-xs text-[#263648] dark:text-[#CBD5E1]"
      aria-label="Navegação da paginação"
    >
      <div className="flex items-center gap-2">
        <span>
          Mostrando <strong className="font-mono">{startItem}</strong> a{' '}
          <strong className="font-mono">{endItem}</strong> de{' '}
          <strong className="font-mono">{totalItems}</strong> registros
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-3">
            <span className="text-[#667085] dark:text-[#94A3B8]">Por página:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] rounded px-2 py-1 text-xs text-[#0B1F33] dark:text-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
              aria-label="Registros por página"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md border border-[#D7DEE8] dark:border-[#263548] bg-white dark:bg-[#131F2E] text-[#263648] dark:text-[#CBD5E1] hover:bg-[#F6F8FB] dark:hover:bg-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 text-xs text-[#667085] dark:text-[#94A3B8]">
          Página <strong className="font-mono text-[#0B1F33] dark:text-[#F8FAFC]">{currentPage}</strong> de{' '}
          <strong className="font-mono text-[#0B1F33] dark:text-[#F8FAFC]">{Math.max(1, totalPages)}</strong>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md border border-[#D7DEE8] dark:border-[#263548] bg-white dark:bg-[#131F2E] text-[#263648] dark:text-[#CBD5E1] hover:bg-[#F6F8FB] dark:hover:bg-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
