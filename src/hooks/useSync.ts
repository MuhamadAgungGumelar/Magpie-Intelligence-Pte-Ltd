'use client';

import { useState, useEffect } from 'react';
import { syncApi, SyncParams } from '@/lib/api/sync';
import useUIStore from '@/store/uiStore';

export const useSync = () => {
  const [syncing, setSyncing] = useState(false);
  const { lastSyncAt, setLastSyncAt } = useUIStore();

  const triggerSync = async (params?: SyncParams) => {
    setSyncing(true);
    try {
      const response = await syncApi.syncArticles(params);
      const syncData = response.data;

      setLastSyncAt(syncData.lastSyncAt);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastSyncAt', syncData.lastSyncAt);
      }

      return syncData;
    } catch (error) {
      throw error;
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    // Load last sync time from localStorage
    if (typeof window !== 'undefined') {
      const storedLastSync = localStorage.getItem('lastSyncAt');
      if (storedLastSync) {
        setLastSyncAt(storedLastSync);
      }
    }
  }, [setLastSyncAt]);

  return {
    syncing,
    lastSyncAt,
    triggerSync
  };
};
