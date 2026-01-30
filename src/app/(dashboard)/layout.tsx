// Dashboard layout with sidebar and header
import DashboardLayoutClient from '@/components/layout/DashboardLayoutClient'
import { getLastSyncInfo } from '@/lib/db/analytics'
import { formatDistanceToNow } from 'date-fns'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const lastSync = await getLastSyncInfo()
  const lastSyncTime = lastSync
    ? formatDistanceToNow(lastSync.completedAt || lastSync.createdAt, { addSuffix: true })
    : null

  return <DashboardLayoutClient lastSyncTime={lastSyncTime}>{children}</DashboardLayoutClient>
}
