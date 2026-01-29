// Order-related database operations
// Used by Trigger.dev sync jobs

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export type OrderItemInput = {
  productId: string
  quantity: number
  price: number
}

export type OrderCreateInput = {
  id: string
  orderDate: Date
  customerName: string
  customerEmail?: string
  status: string
  totalAmount: number
  items: OrderItemInput[]
}

/**
 * Upsert a single order with its order items
 * Used during sync from external API
 */
export async function upsertOrder(data: OrderCreateInput) {
  // First, upsert the order
  const order = await prisma.order.upsert({
    where: {
      id: data.id,
    },
    update: {
      orderDate: data.orderDate,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      status: data.status,
      totalAmount: data.totalAmount,
      syncedAt: new Date(),
    },
    create: {
      id: data.id,
      orderDate: data.orderDate,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      status: data.status,
      totalAmount: data.totalAmount,
      syncedAt: new Date(),
    },
  })

  // Delete existing order items for this order
  await prisma.orderItem.deleteMany({
    where: {
      orderId: data.id,
    },
  })

  // Create new order items
  if (data.items.length > 0) {
    await prisma.orderItem.createMany({
      data: data.items.map((item) => ({
        orderId: data.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    })
  }

  return order
}

/**
 * Upsert multiple orders
 * Batch operation for sync jobs
 */
export async function upsertOrders(orders: OrderCreateInput[]) {
  const results = await Promise.all(orders.map((order) => upsertOrder(order)))
  return results
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

/**
 * Get all orders
 */
export async function getAllOrders() {
  return prisma.order.findMany({
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
}
