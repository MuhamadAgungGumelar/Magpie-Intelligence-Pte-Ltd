// MetricCards Component - Server Component
// Displays 4 key metrics: Total Revenue, Order Count, AOV, Avg Rating

import { DashboardMetrics } from '@/lib/types/database'
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiStar } from 'react-icons/fi'

interface MetricCardsProps {
  data: DashboardMetrics
}

export default function MetricCards({ data }: MetricCardsProps) {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${data.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColorDark: 'dark:bg-blue-600',
    },
    {
      title: 'Total Orders',
      value: data.orderCount.toLocaleString(),
      icon: FiShoppingCart,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgColorDark: 'dark:bg-green-600',
    },
    {
      title: 'Average Order Value',
      value: `$${data.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: FiTrendingUp,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColorDark: 'dark:bg-purple-600',
    },
    {
      title: 'Average Product Rating',
      value: data.averageProductRating.toFixed(2),
      icon: FiStar,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColorDark: 'dark:bg-yellow-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.bgColor} bg-opacity-10 ${metric.bgColorDark}`}>
                <Icon className={`w-6 h-6 ${metric.textColor} dark:text-white`} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {metric.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}
