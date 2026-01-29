"use client";

import React from "react";
import { AnalyticsSummary } from "@/lib/types/analytics";
import {
  MdArticle,
  MdCategory,
  MdTrendingUp,
  MdAccessTime,
} from "react-icons/md";
import { CATEGORY_LABELS } from "@/lib/utils/constants";

interface SummaryCardsProps {
  summary: AnalyticsSummary | null;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  if (!summary) return null;

  const cards = [
    {
      label: "Total Articles",
      value: summary.totalArticles,
      icon: MdArticle,
      color: "text-blue-500",
    },
    {
      label: "Total Categories",
      value: summary.topCategory.count,
      icon: MdCategory,
      color: "text-green-500",
    },
    {
      label: "Top Category",
      value: `${CATEGORY_LABELS[summary.topCategory.name]} (${
        summary.topCategory.count
      })`,
      icon: MdTrendingUp,
      color: "text-purple-500",
    },
    {
      label: "Latest Article",
      value: summary.latestArticle
        ? summary.latestArticle.title.substring(0, 40) + "..."
        : "N/A",
      icon: MdAccessTime,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 dark:text-gray-200">
                {card.label}
              </p>
              <p className="text-2xl font-bold mb-1 dark:text-gray-200">
                {card.value}
              </p>
            </div>
            <card.icon className={`w-10 h-10 ${card.color} opacity-30`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
