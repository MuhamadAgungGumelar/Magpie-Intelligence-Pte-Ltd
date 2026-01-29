"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { CategoryDistribution } from "@/lib/types/analytics";
import { CHART_COLORS, CATEGORY_LABELS } from "@/lib/utils/constants";

interface CategoryPieChartProps {
  data: CategoryDistribution[];
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    name: CATEGORY_LABELS[item.category],
    value: item.count,
    percentage: item.percentage,
    color: CHART_COLORS[item.category],
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">
        Category Distribution
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) =>
              percent ? `${(percent * 100).toFixed(1)}%` : "0%"
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(
              value: number | undefined,
              name: string | undefined,
              props: { payload?: { percentage: number } }
            ) => [
              `${value || 0} articles (${
                props.payload?.percentage.toFixed(1) || 0
              }%)`,
              name || "",
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
