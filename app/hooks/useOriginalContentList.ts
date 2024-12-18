'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface OriginalContent {
  id: string;
  userId: string;
  title: string;
  content_type: string;
  content_url: string;
  content_text: string;
  file_path: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
  repurposed_content?: {
    id: string;
    output_type: string;
    tone: string;
    content: string;
  }[];
}

interface UseOriginalContentListReturn {
  contentList: OriginalContent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOriginalContentList(): UseOriginalContentListReturn {
  const [contentList, setContentList] = useState<OriginalContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContentList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('original_content')
        .select(`
          *,
          repurposed_content (
            id,
            output_type,
            tone,
            content
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
