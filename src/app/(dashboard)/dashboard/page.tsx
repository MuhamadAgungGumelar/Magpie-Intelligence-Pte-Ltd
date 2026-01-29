"use client";

import React from "react";
import useUIStore from "@/store/uiStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import SummaryCards from "@/components/dashboard/SummaryCards";
import DateRangeFilter from "@/components/dashboard/DateRangeFilter";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import TimelineColumnChart from "@/components/dashboard/TimelineColumnChart";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorAlert from "@/components/common/ErrorAlert";

export default function DashboardPage() {
  const { dashboardDateRange, setDashboardDateRange } = useUIStore();
  const { categoryData, timelineData, summary, loading, error, refetch } =
    useAnalytics(dashboardDateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load dashboard"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">
          Analytics Dashboard
        </h1>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Date Range Filter */}
      <DateRangeFilter
        value={dashboardDateRange}
        onChange={setDashboardDateRange}
        presets
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={categoryData} />
        <TimelineColumnChart data={timelineData} />
      </div>
    </div>
  );
}
