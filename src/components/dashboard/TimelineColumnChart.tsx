"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TimelineData } from "@/lib/types/analytics";
import { formatDate } from "@/lib/utils/date";

interface TimelineColumnChartProps {
  data: TimelineData[];
}

const TimelineColumnChart: React.FC<TimelineColumnChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    date: formatDate(item.date, "MMM dd"),
    count: item.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Articles Timeline</h2>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">
        Articles Timeline
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#ff2e87" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineColumnChart;
