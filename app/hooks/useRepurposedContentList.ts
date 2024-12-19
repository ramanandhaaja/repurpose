'use client';

import { useState, useEffect } from 'react';
import { RepurposedContent, listRepurposedContent } from '../lib/services/repurposed-content';

interface UseRepurposedContentListReturn {
  contentList: RepurposedContent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRepurposedContentList(): UseRepurposedContentListReturn {
  const [contentList, setContentList] = useState<RepurposedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContentList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await listRepurposedContent();

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
    refetch: fetchContentList,
  };
}
