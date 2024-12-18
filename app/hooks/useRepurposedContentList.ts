'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RepurposedContent {
  id: string;
  original_content_id: string;
  output_type: string;
  tone: string;
  content: string;
  created_at: string;
}

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

      const { data, error: fetchError } = await supabase
        .from('repurposed_content')
        .select(`
          *,
          original_content (
            title,
            content_type
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
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
