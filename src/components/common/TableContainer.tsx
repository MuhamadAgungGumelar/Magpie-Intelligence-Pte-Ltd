"use client";

import React, { useState } from "react";
import {
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdArrowUpward,
  MdArrowDownward,
  MdSwapVert,
  MdAdd,
} from "react-icons/md";

interface ColumnDefinition<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CurrentSort {
  sortBy: string;
  sortOrder: "ASC" | "DESC" | "";
}

interface TableContainerProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  pagination?: PaginationInfo | null;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (query: string) => void;
  onSort?: (field: string, order: "ASC" | "DESC" | "") => void;
  currentSort?: CurrentSort;
  searchPlaceholder?: string;
  handleCreate?: () => void;
  createLabel?: string;
  rightSearchComponent?: React.ReactNode;
}

/**
 * Reusable Table Component with Server-Side Pagination, Search, and Sorting
 *
 * @param {Array} columns - Column definitions [{ key, label, sortable, render }]
 * @param {Array} data - Table data
 * @param {Object} pagination - Pagination info { page, limit, total, totalPages }
 * @param {boolean} isLoading - Loading state
 * @param {Function} onPageChange - Callback when page changes
 * @param {Function} onLimitChange - Callback when page size changes
 * @param {Function} onSearch - Callback when search query changes
 * @param {Function} onSort - Callback when sort changes
 * @param {Object} currentSort - Current sort state { sortBy, sortOrder }
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {Function} handleCreate - Callback when create button is clicked
 * @param {string} createLabel - Create button label
 * @param {React.ReactNode} rightSearchComponent - Custom search component
 */
const TableContainer = <T extends { id?: string | number }>({
  columns = [],
  data = [],
  pagination = null,
  isLoading = false,
  onPageChange,
  onLimitChange,
  onSearch,
  onSort,
  currentSort = { sortBy: "", sortOrder: "" },
  searchPlaceholder = "Search...",
  handleCreate,
  createLabel = "",
  rightSearchComponent,
}: TableContainerProps<T>) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Debounce search
    if (onSearch) {
      // @ts-expect-error - window timeout
      clearTimeout(window.searchTimeout);
      // @ts-expect-error - window timeout
      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, 500);
    }
  };

  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    let newSortOrder: "ASC" | "DESC" | "" = "ASC";

    if (currentSort.sortBy === columnKey) {
      if (currentSort.sortOrder === "ASC") {
        newSortOrder = "DESC";
      } else {
        // Clear sort
        onSort("", "");
        return;
      }
    }

    onSort(columnKey, newSortOrder);
  };

  const renderSortIcon = (columnKey: string) => {
    if (currentSort.sortBy !== columnKey) {
      return (
        <MdSwapVert className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      );
    }

    return currentSort.sortOrder === "ASC" ? (
      <MdArrowUpward className="w-4 h-4 text-red-600 dark:text-red-500" />
    ) : (
      <MdArrowDownward className="w-4 h-4 text-red-600 dark:text-red-500" />
    );
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { page, limit, total, totalPages } = pagination;

    const pageNumbers = [];
    const maxVisible = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-200">
            Showing
          </span>
          <select
            value={limit}
            onChange={(e) =>
              onLimitChange && onLimitChange(Number(e.target.value))
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
          >
            {[5, 10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-200">
            results
          </span>
        </div>

        {/* Page Info */}
        <div className="text-sm text-gray-700 dark:text-gray-200">
          Showing page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span> ({total} total)
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="p-2 rounded-md hover:bg-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
          >
            <MdChevronLeft className="w-5 h-5" />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange && onPageChange(1)}
                className="px-3 py-1 rounded-md hover:bg-white dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-2 text-gray-700 dark:text-gray-200">
                  ...
                </span>
              )}
            </>
          )}

          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange && onPageChange(pageNum)}
              className={`px-3 py-1 rounded-md transition-colors ${
                pageNum === page
                  ? "bg-red-600 text-white font-semibold"
                  : "hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 text-gray-700 dark:text-gray-200">
                  ...
                </span>
              )}
              <button
                onClick={() => onPageChange && onPageChange(totalPages)}
                className="px-3 py-1 rounded-md hover:bg-white dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="p-2 rounded-md hover:bg-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
          >
            <MdChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Search Bar */}
      <div className="flex justify-between">
        {onSearch && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative max-w-md">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
        )}

        {handleCreate ? (
          <div className="p-4">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <MdAdd className="w-5 h-5" />
              {createLabel}
            </button>
          </div>
        ) : rightSearchComponent ? (
          rightSearchComponent
        ) : null}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                    column.sortable
                      ? "cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600"
                      : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Loading...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.render
                        ? column.render(row)
                        : (row as never)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default TableContainer;
