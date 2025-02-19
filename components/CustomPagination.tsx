"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  itemSize: number;
  currentPage: number;
  setPage: (page: number) => void;
}

export function CustomPagination({
  itemSize,
  currentPage,
  setPage,
}: CustomPaginationProps) {
  const handlePageClick = (page: number) => {
    setPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4;

    // Always show the first page
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="?page=1"
          className={`rounded border border-gray-300 p-2 ${
            currentPage === 1 ? "bg-primary/40 text-white" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            handlePageClick(1);
          }}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // Show an ellipsis if we are beyond the maxVisiblePages on the first page
    if (currentPage > maxVisiblePages) {
      pages.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    // Dynamic range of visible pages around the current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(itemSize - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <PaginationItem key={page}>
          <PaginationLink
            href={`?page=${page}`}
            className={`rounded border border-gray-300 p-2 ${
              page === currentPage ? "bg-primary/40 text-white" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(page);
            }}
          >
            {page}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Show an ellipsis if there are more pages after the last visible page
    if (currentPage < itemSize - maxVisiblePages) {
      pages.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    // Always show the last page
    if (itemSize > 1) {
      pages.push(
        <PaginationItem key={itemSize}>
          <PaginationLink
            href={`?page=${itemSize}`}
            className={`rounded border border-gray-300 p-2 ${
              currentPage === itemSize ? "bg-primary/40 text-white" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(itemSize);
            }}
          >
            {itemSize}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${Math.max(1, currentPage - 1)}`}
            className="rounded border border-gray-300 p-2"
            onClick={(e) => {
              e.preventDefault();
              setPage(Math.max(1, currentPage - 1));
            }}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            href={`?page=${Math.min(itemSize, currentPage + 1)}`}
            className="rounded border border-gray-300 p-2"
            onClick={(e) => {
              e.preventDefault();
              setPage(Math.min(itemSize, currentPage + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
