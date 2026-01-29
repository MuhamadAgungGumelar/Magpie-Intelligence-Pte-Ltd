export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SyncResult {
  syncedCount: number;
  updatedCount: number;
  skippedCount: number;
  lastSyncAt: string;
  duration: number;
  triggeredBy: {
    id: string;
    name: string;
  };
}
