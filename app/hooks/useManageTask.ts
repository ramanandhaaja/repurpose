'use client';

import { useState, useEffect } from 'react';
import { listOriginalContent, type OriginalContent } from '@/lib/services/original-content';
import { supabase } from '@/lib/supabase';
import { createScheduledPost, type CreateScheduledPostInput } from '@/lib/services/scheduled-post';

interface UseOriginalContentListReturn {
  contentList: OriginalContent[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useOriginalContentList(): UseOriginalContentListReturn {
  const [contentList, setContentList] = useState<OriginalContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;

  const fetchContentList = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError, count } = await listOriginalContent(page, pageSize);

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        if (page === 1) {
          setContentList(data);
        } else {
          setContentList(prev => [...prev, ...data]);
        }
        setTotalCount(count);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content list');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    const nextPage = currentPage + 1;
    await fetchContentList(nextPage);
    setCurrentPage(nextPage);
  };

  const refetch = async () => {
    setCurrentPage(1);
    await fetchContentList(1);
  };

  useEffect(() => {
    fetchContentList(1);
  }, []);

  return {
    contentList,
    isLoading,
    error,
    hasMore: contentList.length < totalCount,
    loadMore,
    refetch
  };
}

interface ScheduledPost {
  platform: string;
  content: string;
  scheduled_for: string;
  original_content_id: string;
  repurposed_content_id: string;
  status: 'pending' | 'published' | 'failed';
}

export function useSchedulePost() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schedulePost = async ({
    platform,
    content,
    scheduledFor,
    originalContentId,
    repurposedContentId
  }: CreateScheduledPostInput) => {
    try {
      setIsScheduling(true);
      setError(null);

      const data = await createScheduledPost({
        platform,
        content,
        scheduledFor,
        originalContentId,
        repurposedContentId
      });

      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsScheduling(false);
    }
  };

  return {
    schedulePost,
    isScheduling,
    error,
  };
}
