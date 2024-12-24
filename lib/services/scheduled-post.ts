import { supabase } from '../supabase';

export interface ScheduledPost {
  id: string;
  user_id: string;
  platform: string;
  content: string;
  scheduled_for: string;
  status: 'pending' | 'published' | 'failed';
  original_content_id: string;
  repurposed_content_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateScheduledPostInput {
  platform: string;
  content: string;
  scheduledFor: Date;
  originalContentId: string;
  repurposedContentId: string;
}

export class ScheduledPostError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScheduledPostError';
  }
}

export async function createScheduledPost(input: CreateScheduledPostInput): Promise<ScheduledPost> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new ScheduledPostError(userError.message);

    const { data, error: scheduleError } = await supabase
      .from('scheduled_posts')
      .insert([
        {
          user_id: userData.user.id,
          platform: input.platform,
          content: input.content,
          scheduled_for: input.scheduledFor.toISOString(),
          status: 'pending',
          original_content_id: input.originalContentId,
          repurposed_content_id: input.repurposedContentId,
        },
      ])
      .select()
      .single();

    if (scheduleError) throw new ScheduledPostError(scheduleError.message);
    if (!data) throw new ScheduledPostError('Failed to create scheduled post');

    return data;
  } catch (err) {
    if (err instanceof ScheduledPostError) throw err;
    throw new ScheduledPostError(err instanceof Error ? err.message : 'Unknown error occurred');
  }
}

export async function listScheduledPosts(): Promise<ScheduledPost[]> {
  const { data, error } = await supabase
    .from('scheduled_posts')
    .select('*')
    .order('scheduled_for', { ascending: true });

  if (error) throw new ScheduledPostError(error.message);
  return data || [];
}

export async function updateScheduledPost(
  id: string,
  updates: Partial<Omit<ScheduledPost, 'id' | 'created_at' | 'updated_at'>>
): Promise<ScheduledPost> {
  const { data, error } = await supabase
    .from('scheduled_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new ScheduledPostError(error.message);
  if (!data) throw new ScheduledPostError('Failed to update scheduled post');

  return data;
}

export async function deleteScheduledPost(id: string): Promise<void> {
  const { error } = await supabase
    .from('scheduled_posts')
    .delete()
    .eq('id', id);

  if (error) throw new ScheduledPostError(error.message);
}