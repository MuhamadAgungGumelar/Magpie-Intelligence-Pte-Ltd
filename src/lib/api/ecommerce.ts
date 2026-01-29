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
    id: externalProduct.id,
    name: externalProduct.name,
    category: externalProduct.category,
    price: externalProduct.price,
    rating: externalProduct.rating,
    stock: externalProduct.stock,
    description: externalProduct.description,
    imageUrl: externalProduct.image,
  }
}

/**
 * Transform external order to database format
 */
export function transformOrder(externalOrder: ExternalOrder) {
  return {
    id: externalOrder.id,
    orderDate: new Date(externalOrder.order_date),
    customerName: externalOrder.customer_name,
    customerEmail: externalOrder.customer_email,
    status: externalOrder.status,
    totalAmount: externalOrder.total_amount,
    items: externalOrder.items.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
    })),
  }
}
