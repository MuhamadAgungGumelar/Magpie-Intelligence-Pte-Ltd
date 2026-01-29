"use client";

import React from "react";
import Link from "next/link";
import { MdArrowBack, MdChevronRight } from "react-icons/md";

interface BreadcrumbItem {
  link: string;
  name: string;
}

interface BreadcrumbProps {
  backLink: string;
  currentPage: string;
  breadcrumbItems?: BreadcrumbItem[];
}

/**
 * Reusable Breadcrumb Component
 *
 * @param {string} backLink - URL to navigate back
 * @param {string} currentPage - Current active page name
 * @param {Array} breadcrumbItems - Array of breadcrumb items [{link: string, name: string}]
 *
 * @example
 * <Breadcrumb
 *   backLink="/management"
 *   currentPage="Create Article"
 *   breadcrumbItems={[
 *     { link: "/dashboard", name: "Dashboard" },
 *     { link: "/management", name: "Management" }
 *   ]}
 * />
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({
  backLink,
  currentPage,
  breadcrumbItems = [],
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Left: Back Button + Title */}
      <div className="flex items-center gap-3">
        <Link
          href={backLink}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          aria-label="Go back"
        >
          <MdArrowBack className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentPage}</h1>
      </div>

      {/* Right: Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="flex items-center">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <Link
                href={item.link}
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {item.name}
              </Link>
              <MdChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            </li>
          ))}
          <li className="text-gray-900 dark:text-gray-100 font-medium">{currentPage}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
