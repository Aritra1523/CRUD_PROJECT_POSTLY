import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, goToPage }) => {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis logic
  const getPages = () => {
    const pages = [];
    const delta = 1; // neighbours around current

    const left = currentPage - delta;
    const right = currentPage + delta;

    let last = 0;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        if (last && i - last > 1) pages.push("...");
        pages.push(i);
        last = i;
      }
    }
    return pages;
  };

  const pages = getPages();

  const btnBase = {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 36, height: 36, borderRadius: 10, fontSize: 14, fontWeight: 600,
    cursor: "pointer", border: "1.5px solid #e4e0fb", transition: "all .15s",
    userSelect: "none",
  };

  const activeStyle = {
    ...btnBase,
    background: "#4f46e5", color: "#fff", border: "1.5px solid #4f46e5",
    boxShadow: "0 2px 8px rgba(79,70,229,.35)",
  };

  const inactiveStyle = {
    ...btnBase,
    background: "#fff", color: "#374151",
  };

  const arrowStyle = (disabled) => ({
    ...btnBase,
    background: disabled ? "#f3f4f6" : "#fff",
    color: disabled ? "#d1d5db" : "#4f46e5",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 6, marginTop: 40, flexWrap: "wrap",
    }}>
      {/* Prev */}
      <button
        style={arrowStyle(currentPage === 1)}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            style={{ width: 36, textAlign: "center", color: "#9ca3af", fontSize: 14 }}
          >
            …
          </span>
        ) : (
          <button
            key={page}
            style={page === currentPage ? activeStyle : inactiveStyle}
            onClick={() => goToPage(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        style={arrowStyle(currentPage === totalPages)}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
