// API Route: Manual Sync Trigger
// POST /api/sync/trigger
// Optional endpoint to manually trigger sync job

import { NextRequest, NextResponse } from 'next/server'
import { tasks } from '@trigger.dev/sdk/v3'

export async function POST(request: NextRequest) {
  try {
    // Trigger the sync job manually
    const handle = await tasks.trigger('sync-ecommerce-data', {})

    return NextResponse.json(
      {
        success: true,
        message: 'Sync job triggered successfully',
        taskId: handle.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error triggering sync job:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to trigger sync job',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to check sync status
export async function GET(request: NextRequest) {
  try {
    // You can add logic here to check the status of the last sync
    // For now, just return a simple message
    return NextResponse.json(
      {
        message: 'Sync API is running',
        endpoint: 'POST /api/sync/trigger to manually trigger sync',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
