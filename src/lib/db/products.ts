// Product-related database operations
// Used by Trigger.dev sync jobs

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export type ProductCreateInput = {
  id: string
  name: string
  category: string
  price: number
  rating?: number
  stock?: number
  description?: string
  imageUrl?: string
}

/**
 * Upsert a single product
 * Used during sync from external API
 */
export async function upsertProduct(data: ProductCreateInput) {
  return prisma.product.upsert({
    where: {
      id: data.id,
    },
    update: {
      name: data.name,
      category: data.category,
      price: data.price,
      rating: data.rating,
      stock: data.stock,
      description: data.description,
      imageUrl: data.imageUrl,
      syncedAt: new Date(),
    },
    create: {
      id: data.id,
      name: data.name,
      category: data.category,
      price: data.price,
      rating: data.rating,
      stock: data.stock,
      description: data.description,
      imageUrl: data.imageUrl,
      syncedAt: new Date(),
    },
  })
}

/**
 * Upsert multiple products
 * Batch operation for sync jobs
 */
export async function upsertProducts(products: ProductCreateInput[]) {
  const results = await Promise.all(
    products.map((product) => upsertProduct(product))
  )
  return results
}

/**
 * Get product by ID
 */
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  })
}

/**
 * Get all products
 */
export async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}
