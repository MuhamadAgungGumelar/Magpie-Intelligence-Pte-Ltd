// Database Query Functions for Analytics Dashboard
// All queries used by Server Components

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

/**
 * Get Dashboard Metrics
 * Returns: Total Revenue, Order Count, Average Order Value, Average Product Rating
 */
export async function getDashboardMetrics() {
  const [orderStats, productRating] = await Promise.all([
    // Order statistics (excluding cancelled orders)
    prisma.order.aggregate({
      where: {
        status: {
          not: 'cancelled',
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        totalAmount: true,
      },
    }),

    // Average product rating
    prisma.product.aggregate({
      where: {
        rating: {
          not: null,
        },
      },
      _avg: {
        rating: true,
      },
    }),
  ])

  return {
    totalRevenue: orderStats._sum.totalAmount?.toNumber() || 0,
    orderCount: orderStats._count.id || 0,
    averageOrderValue: orderStats._avg.totalAmount?.toNumber() || 0,
    averageProductRating: productRating._avg.rating?.toNumber() || 0,
  }
}

/**
 * Get Orders Grouped by Status
 * For Pie/Donut Chart
 */
export async function getOrdersByStatus() {
  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
  })

  return ordersByStatus.map((item) => ({
    name: item.status,
    value: item._count.id,
  }))
}

/**
 * Get Products Grouped by Category
 * For Bar/Column Chart
 */
export async function getProductsByCategory() {
  const productsByCategory = await prisma.product.groupBy({
    by: ['category'],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
  })

  return productsByCategory.map((item) => ({
    category: item.category,
    count: item._count.id,
  }))
}

/**
 * Get Recent Orders
 * Latest 5 orders with order items and products
 */
export async function getRecentOrders() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      orderDate: 'desc',
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })

  return orders
}

/**
 * Get Top Products
 * 5 highest priced products
 */
export async function getTopProducts() {
  const products = await prisma.product.findMany({
    take: 5,
    orderBy: {
      price: 'desc',
    },
  })

  return products
}

/**
 * Get Revenue by Category (Custom Insight)
 * Calculate total revenue for each product category
 */
export async function getRevenueByCategory() {
  // Raw SQL query for better performance
  const result = await prisma.$queryRaw<
    Array<{ category: string; revenue: number; orderCount: bigint }>
  >`
    SELECT
      p.category,
      SUM(oi.price * oi.quantity) as revenue,
      COUNT(DISTINCT o.id) as "orderCount"
    FROM order_items oi
    INNER JOIN products p ON oi.product_id = p.id
    INNER JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'cancelled'
    GROUP BY p.category
    ORDER BY revenue DESC
  `

  return result.map((item) => ({
    category: item.category,
    revenue: Number(item.revenue),
    orderCount: Number(item.orderCount),
  }))
}

/**
 * Get All Dashboard Data
 * Single function to fetch all data needed for dashboard
 * Optimized with Promise.all for parallel queries
 */
export async function getAllDashboardData() {
  const [
    metrics,
    ordersByStatus,
    productsByCategory,
    recentOrders,
    topProducts,
    revenueByCategory,
  ] = await Promise.all([
    getDashboardMetrics(),
    getOrdersByStatus(),
    getProductsByCategory(),
    getRecentOrders(),
    getTopProducts(),
    getRevenueByCategory(),
  ])

  return {
    metrics,
    ordersByStatus,
    productsByCategory,
    recentOrders,
    topProducts,
    revenueByCategory,
  }
}

/**
 * Get Last Sync Info
 * Returns the most recent successful sync log
 */
export async function getLastSyncInfo() {
  const lastSync = await prisma.syncLog.findFirst({
    where: {
      status: 'success',
    },
    orderBy: {
      completedAt: 'desc',
    },
  })

  return lastSync
}
