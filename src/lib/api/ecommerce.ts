// External E-commerce API Client
// Fetch data from fake-store-api.mock.beeceptor.com

import axios from 'axios'
import type { ExternalProduct, ExternalOrder } from '@/lib/types/database'

const API_BASE_URL = 'https://fake-store-api.mock.beeceptor.com/api'

/**
 * Fetch all products from external API
 */
export async function fetchProducts(): Promise<ExternalProduct[]> {
  try {
    const response = await axios.get<ExternalProduct[]>(
      `${API_BASE_URL}/products`,
      {
        timeout: 10000, // 10 second timeout
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products from external API')
  }
}

/**
 * Fetch all orders from external API
 */
export async function fetchOrders(): Promise<ExternalOrder[]> {
  try {
    const response = await axios.get<ExternalOrder[]>(
      `${API_BASE_URL}/orders`,
      {
        timeout: 10000, // 10 second timeout
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Failed to fetch orders from external API')
  }
}

/**
 * Transform external product to database format
 */
export function transformProduct(externalProduct: ExternalProduct) {
  return {
    id: String(externalProduct.product_id),
    name: externalProduct.name,
    category: externalProduct.category,
    price: externalProduct.price,
    rating: externalProduct.rating,
    stock: externalProduct.availability ? 100 : 0, // Mock stock based on availability
    description: externalProduct.description,
    imageUrl: externalProduct.image,
  }
}

/**
 * Transform external order to database format
 */
export function transformOrder(externalOrder: ExternalOrder) {
  // Generate random date within last 30 days
  const randomDaysAgo = Math.floor(Math.random() * 30)
  const orderDate = new Date()
  orderDate.setDate(orderDate.getDate() - randomDaysAgo)

  // Map status from API to our database statuses
  const statusMap: Record<string, string> = {
    'Shipped': 'processing',
    'Delivered': 'completed',
    'Processing': 'processing',
    'Pending': 'pending',
    'Cancelled': 'cancelled',
  }

  const mappedStatus = statusMap[externalOrder.status] || 'pending'

  // Calculate individual item prices from total
  const itemPrice = externalOrder.items.length > 0
    ? externalOrder.total_price / externalOrder.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0

  return {
    id: String(externalOrder.order_id),
    orderDate: orderDate,
    customerName: `Customer ${externalOrder.user_id}`,
    customerEmail: `customer${externalOrder.user_id}@example.com`,
    status: mappedStatus,
    totalAmount: externalOrder.total_price,
    items: externalOrder.items.map((item) => ({
      productId: String(item.product_id),
      quantity: item.quantity,
      price: itemPrice, // Approximate item price
    })),
  }
}
