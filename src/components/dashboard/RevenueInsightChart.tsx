'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RevenueByCategoryData {
  category: string;
  revenue: number;
  orderCount: number;
}

interface RevenueInsightChartProps {
  data: RevenueByCategoryData[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function RevenueInsightChart({ data }: RevenueInsightChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue by Category</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Custom insight showing revenue performance across product categories</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis
            dataKey="category"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: any, name?: string) => {
              const numValue = Number(value) || 0;
              if (name === 'revenue') {
                return [`$${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue'];
              }
              return [numValue, 'Orders'];
            }}
            labelStyle={{ color: '#111827', fontWeight: 600, marginBottom: '4px' }}
          />
          <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{item.category}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.orderCount} orders</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
