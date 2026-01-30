// Dashboard Page - Server Component
// Fetches all data directly from database via Prisma

// Force dynamic rendering (don't pre-render during build)
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getAllDashboardData, getLastSyncInfo } from '@/lib/db/analytics'
import MetricCards from '@/components/dashboard/MetricCards'
import OrdersStatusChart from '@/components/dashboard/OrdersStatusChart'
import ProductsCategoryChart from '@/components/dashboard/ProductsCategoryChart'
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable'
import TopProductsTable from '@/components/dashboard/TopProductsTable'
import RevenueInsightChart from '@/components/dashboard/RevenueInsightChart'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { formatDistanceToNow } from 'date-fns'

export default async function DashboardPage() {
  // Fetch all dashboard data in parallel
  const [data, lastSync] = await Promise.all([
    getAllDashboardData(),
    getLastSyncInfo(),
  ])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time insights from your e-commerce data
          </p>
          {lastSync && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Last synced: {formatDistanceToNow(lastSync.completedAt || lastSync.createdAt, { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Metric Cards */}
        <Suspense fallback={<LoadingSpinner />}>
          <MetricCards data={data.metrics} />
        </Suspense>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Suspense fallback={<LoadingSpinner />}>
            <OrdersStatusChart data={data.ordersByStatus} />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <ProductsCategoryChart data={data.productsByCategory} />
          </Suspense>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Suspense fallback={<LoadingSpinner />}>
            <RecentOrdersTable orders={data.recentOrders} />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <TopProductsTable products={data.topProducts} />
          </Suspense>
        </div>

        {/* Custom Insight Chart */}
        <Suspense fallback={<LoadingSpinner />}>
          <RevenueInsightChart data={data.revenueByCategory} />
        </Suspense>
      </div>
    </div>
  )
}
