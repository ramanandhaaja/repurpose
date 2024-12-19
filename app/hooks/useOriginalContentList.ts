'use client';

import { useState, useEffect } from 'react';
import { listOriginalContent, type OriginalContent } from '../lib/services/original-content';

interface UseOriginalContentListReturn {
  contentList: OriginalContent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOriginalContentList(): UseOriginalContentListReturn {
  const [contentList, setContentList] = useState<OriginalContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContentList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await listOriginalContent();

      if (fetchError) {
        throw fetchError;
      }

      setContentList(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContentList();
  }, []);

  return {
    contentList,
    isLoading,
    error,
    refetch: fetchContentList
  };
}
