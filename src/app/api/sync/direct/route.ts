// Direct Sync API Route (No Trigger.dev required)
// POST /api/sync/direct
// Directly syncs data from external API to database

import { NextRequest, NextResponse } from 'next/server'
import { fetchProducts, fetchOrders, transformProduct, transformOrder } from '@/lib/api/ecommerce'
import { upsertProducts } from '@/lib/db/products'
import { upsertOrders } from '@/lib/db/orders'
import { createSyncLog } from '@/lib/db/syncLogs'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  const startTime = new Date()
  let productsCount = 0
  let ordersCount = 0

  try {
    console.log('🚀 Starting direct sync...')

    // Step 1: Fetch and sync products
    console.log('📦 Fetching products from external API...')
    const externalProducts = await fetchProducts()
    console.log(`✅ Fetched ${externalProducts.length} products`)

    console.log('💾 Upserting products to database...')
    const transformedProducts = externalProducts.map(transformProduct)
    await upsertProducts(transformedProducts)
    productsCount = transformedProducts.length
    console.log(`✅ Upserted ${productsCount} products`)

    // Step 2: Fetch and sync orders
    console.log('📋 Fetching orders from external API...')
    const externalOrders = await fetchOrders()
    console.log(`✅ Fetched ${externalOrders.length} orders`)

    console.log('💾 Upserting orders to database...')
    const transformedOrders = externalOrders.map(transformOrder)
    await upsertOrders(transformedOrders)
    ordersCount = transformedOrders.length
    console.log(`✅ Upserted ${ordersCount} orders`)

    const endTime = new Date()
    const duration = endTime.getTime() - startTime.getTime()

    // Step 3: Create sync log
    await createSyncLog({
      syncType: 'all',
      status: 'success',
      recordsProcessed: productsCount + ordersCount,
      errorMessage: undefined,
      startedAt: startTime,
      completedAt: endTime,
    })

    console.log(`✨ Sync completed in ${duration}ms`)

    return NextResponse.json(
      {
        success: true,
        message: '✅ Sync completed successfully',
        data: {
          productsCount,
          ordersCount,
          totalRecords: productsCount + ordersCount,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error during sync:', error)

    // Log failed sync
    await createSyncLog({
      syncType: 'all',
      status: 'failed',
      recordsProcessed: productsCount + ordersCount,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      startedAt: startTime,
      completedAt: new Date(),
    })

    return NextResponse.json(
      {
        success: false,
        message: '❌ Sync failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET endpoint for status check
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Direct Sync API Ready',
      endpoints: {
        sync: 'POST /api/sync/direct',
        description: 'Syncs data directly without Trigger.dev',
      },
    },
    { status: 200 }
  )
}
