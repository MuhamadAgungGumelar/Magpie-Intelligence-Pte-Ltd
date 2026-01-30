// ProductsCategoryChart Component - Client Component (Recharts)
// Bar chart showing product count by category

'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ProductsByCategory } from '@/lib/types/database'

interface ProductsCategoryChartProps {
  data: ProductsByCategory[]
}

export default function ProductsCategoryChart({ data }: ProductsCategoryChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Products by Category
      </h2>

      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              tick={{ fill: '#6B7280' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" name="Product Count" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      )}
    </div>
  )
}
