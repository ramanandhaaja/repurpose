import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseKey
)

/*

Table schema

scheduled_posts
"id", "user_id", "platform", "content", "scheduled_for", "status", "created_at", "updated_at", "original_content_id", "repurposed_content_id"

original_content
"id", "title", "content_type", "content_url", "content_text", "file_path", "file_type", "created_at", "updated_at", "userId"

repurposed_content
"id", "original_content_id", "output_type", "tone", "content", "character_count", "is_published", "created_at", "updated_at"

-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant all privileges on the table
GRANT ALL ON TABLE public.original_content TO anon, authenticated;

-- Enable RLS
ALTER TABLE public.original_content ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserts
CREATE POLICY "Enable insert for all users" ON public.original_content
FOR INSERT WITH CHECK (true);

-- Create a policy that allows select for all users
CREATE POLICY "Enable select for all users" ON public.original_content
FOR SELECT USING (true);
*/