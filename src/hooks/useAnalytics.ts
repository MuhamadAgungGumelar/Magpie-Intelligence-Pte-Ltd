'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { analyticsApi } from '@/lib/api/analytics';
import { CategoryDistribution, TimelineData, AnalyticsSummary } from '@/lib/types/analytics';
import { DateRange } from '@/lib/types/common';
import { toISODate } from '@/lib/utils/date';

export const useAnalytics = (dateRange: DateRange) => {
  const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Cache to prevent duplicate requests
  const lastFetchedKey = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Use JSON.stringify to create stable dependency
  const dateRangeKey = JSON.stringify({
    from: toISODate(dateRange.from),
    to: toISODate(dateRange.to),
  });

  const fetchAnalytics = useCallback(async () => {
    // Prevent duplicate fetch with same parameters
    if (lastFetchedKey.current === dateRangeKey && !loading) {
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    lastFetchedKey.current = dateRangeKey;

    setLoading(true);
    setError(null);
    try {
      const params = {
        dateFrom: toISODate(dateRange.from),
        dateTo: toISODate(dateRange.to),
      };

      const [categoryResponse, timelineResponse, summaryResponse] = await Promise.all([
        analyticsApi.getCategoryDistribution(params),
        analyticsApi.getTimeline(params),
        analyticsApi.getSummary(params),
      ]);

      setCategoryData(categoryResponse.data);
      setTimelineData(timelineResponse.data);
      setSummary(summaryResponse.data);
    } catch (err) {
      // Ignore abort errors
      if ((err as Error).name === 'AbortError' || (err as Error).name === 'CanceledError') {
        return;
      }
      setError(err as Error);
      setCategoryData([]);
      setTimelineData([]);
      setSummary(null);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRangeKey]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    categoryData,
    timelineData,
    summary,
    loading,
    error,
    refetch: fetchAnalytics
  };
};
