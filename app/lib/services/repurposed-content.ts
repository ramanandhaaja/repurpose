'use server';

import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';

export interface RepurposedContent {
  id: string;
  original_content_id: string;
  output_type: string;
  tone: string;
  content: string;
  created_at: string;
  original_content?: {
    title: string;
    content_type: string;
  };
}

export async function listRepurposedContent(): Promise<{ data: RepurposedContent[] | null; error: Error | null }> {
  try {
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

    return { data, error: null };
  } catch (err) {
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Failed to fetch content list') 
    };
  }
}

export async function createRepurposedContent(
  originalContentId: string,
  outputType: string,
  tone: string,
  content: string,
  characterCount: number
): Promise<{ data: RepurposedContent | null; error: Error | null }> {
  try {
    console.log('Attempting to create repurposed content...');
    
    // First, check if we can access the table
    const { data: testData, error: testError } = await supabase
      .from('repurposed_content')
      .select('*');
    
    if (testError) {
      console.error('Test query error:', testError);
      return { data: null, error: new Error(`Test query failed: ${testError.message}`) };
    }
    
    const now = new Date().toISOString();
    
    // If we can access the table, try to insert
    const { data, error: insertError } = await supabase
      .from('repurposed_content')
      .insert({
        id: uuidv4(),
        original_content_id: originalContentId,
        output_type: outputType,
        tone: tone,
        content: content,
        character_count: characterCount,
        is_published: false,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return { data: null, error: new Error(`Insert failed: ${insertError.message}`) };
    }

    console.log('Repurposed content created successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to create repurposed content')
    };
  }
}