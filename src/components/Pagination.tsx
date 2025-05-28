import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;
  
  // Calculate page range to display
  const generatePageNumbers = () => {
    const range = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Complex logic for many pages
      let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let end = start + maxPagesToShow - 1;
      
      if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxPagesToShow + 1);
      }
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      
      // Add ellipsis indicators
      if (start > 1) {
        range.unshift(-1); // Use -1 as indicator for left ellipsis
        range.unshift(1);   // Always include first page
      }
      
      if (end < totalPages) {
        range.push(-2);     // Use -2 as indicator for right ellipsis
        range.push(totalPages); // Always include last page
      }
    }
    
    return range;
  };

  const pageNumbers = generatePageNumbers();
  
  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center rounded-md p-2 transition-colors ${
          currentPage === 1
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        // Render ellipsis
        if (page < 0) {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 items-center justify-center text-gray-500"
            >
              &hellip;
            </span>
          );
        }
        
        // Render page number
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
      
      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center rounded-md p-2 transition-colors ${
          currentPage === totalPages
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;