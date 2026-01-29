// TypeScript types for database models
// Export types from Prisma and custom types

import { Prisma } from '@prisma/client'

// Product types
export type Product = Prisma.ProductGetPayload<{}>
export type ProductWithOrderItems = Prisma.ProductGetPayload<{
  include: { orderItems: true }
}>

// Order types
export type Order = Prisma.OrderGetPayload<{}>
export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true
      }
    }
  }
}>

// OrderItem types
export type OrderItem = Prisma.OrderItemGetPayload<{}>
export type OrderItemWithProduct = Prisma.OrderItemGetPayload<{
  include: { product: true }
}>

// SyncLog types
export type SyncLog = Prisma.SyncLogGetPayload<{}>

// Analytics types
export type DashboardMetrics = {
  totalRevenue: number
  orderCount: number
  averageOrderValue: number
  averageProductRating: number
}

export type OrdersByStatus = {
  name: string
  value: number
}

export type ProductsByCategory = {
  category: string
  count: number
}

export type RevenueByCategory = {
  category: string
  revenue: number
}

// External API response types (from fake-store-api)
export type ExternalProduct = {
  id: string
  name: string
  category: string
  price: number
  rating?: number
  stock?: number
  description?: string
  image?: string
}

export type ExternalOrderItem = {
  product_id: string
  quantity: number
  price: number
}

export type ExternalOrder = {
  id: string
  order_date: string
  customer_name: string
  customer_email?: string
  status: string
  total_amount: number
  items: ExternalOrderItem[]
}
