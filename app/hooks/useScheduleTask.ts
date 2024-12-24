'use client';

import { useState, useEffect } from 'react';
import { listScheduledPosts, type ScheduledPost } from '@/lib/services/scheduled-post';

interface UseScheduleTaskReturn {
  scheduledPosts: ScheduledPost[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useScheduleTask(): UseScheduleTaskReturn {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScheduledPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const posts = await listScheduledPosts();
      
      // Sort posts by scheduled_for date
      const sortedPosts = [...posts].sort((a, b) => 
        new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()
      );
      
      setScheduledPosts(sortedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scheduled posts');
      console.error('Error fetching scheduled posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const refetch = async () => {
    await fetchScheduledPosts();
  };

  return {
    scheduledPosts,
    isLoading,
    error,
    refetch
  };
}

// Helper functions to get post statistics
export function getPostsByPlatform(posts: ScheduledPost[]): Record<string, number> {
  return posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getPostsByStatus(posts: ScheduledPost[]): Record<string, number> {
  return posts.reduce((acc, post) => {
    acc[post.status] = (acc[post.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getPostsByDate(posts: ScheduledPost[]): Record<string, ScheduledPost[]> {
  return posts.reduce((acc, post) => {
    const date = new Date(post.scheduled_for).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(post);
    return acc;
  }, {} as Record<string, ScheduledPost[]>);
}

export function getUpcomingPosts(posts: ScheduledPost[], days: number = 7): ScheduledPost[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return posts.filter(post => {
    const postDate = new Date(post.scheduled_for);
    return postDate >= now && postDate <= futureDate;
  });
}

export function getPendingPosts(posts: ScheduledPost[]): ScheduledPost[] {
  return posts.filter(post => post.status === 'pending');
}

export function getFailedPosts(posts: ScheduledPost[]): ScheduledPost[] {
  return posts.filter(post => post.status === 'failed');
}

export function getPublishedPosts(posts: ScheduledPost[]): ScheduledPost[] {
  return posts.filter(post => post.status === 'published');
}