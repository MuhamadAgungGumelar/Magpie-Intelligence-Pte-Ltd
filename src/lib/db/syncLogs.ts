// Sync Log database operations
// Track sync job history and status

import { prisma } from '@/lib/prisma'

export type SyncLogCreateInput = {
  syncType: 'products' | 'orders' | 'all'
  status: 'success' | 'failed' | 'partial'
  recordsProcessed: number
  errorMessage?: string
  startedAt: Date
  completedAt?: Date
}

/**
 * Create a new sync log entry
 */
export async function createSyncLog(data: SyncLogCreateInput) {
  return prisma.syncLog.create({
    data: {
      syncType: data.syncType,
      status: data.status,
      recordsProcessed: data.recordsProcessed,
      errorMessage: data.errorMessage,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
    },
  })
}

/**
 * Get latest sync logs
 */
export async function getRecentSyncLogs(limit = 10) {
  return prisma.syncLog.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * Get sync statistics
 */
export async function getSyncStatistics() {
  const [total, successful, failed] = await Promise.all([
    prisma.syncLog.count(),
    prisma.syncLog.count({
      where: { status: 'success' },
    }),
    prisma.syncLog.count({
      where: { status: 'failed' },
    }),
  ])

  return {
    total,
    successful,
    failed,
    successRate: total > 0 ? (successful / total) * 100 : 0,
  }
}
