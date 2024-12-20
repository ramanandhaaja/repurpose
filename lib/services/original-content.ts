'use server';

import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';

type FileData = {
  name: string;
  type: string;
  size: number;
};

export interface OriginalContent {
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

export interface PaginatedResponse<T> {
  data: T[] | null;
  error: Error | null;
  count: number;
}

export async function createOriginalContent(fileData: FileData, fileContent: string, inputType: string, url: string) {
  console.log('Creating original content with:', { inputType, url });
  
  try {
    console.log('Attempting to upload file and insert content...');
    console.log('File details:', fileData);
    
    // Generate unique filename
    const fileName = `${uuidv4()}-${fileData.name}`;
    
    let uploadData;
    let uploadError;
    
    // Handle file upload based on input type
    if (inputType === 'image' && fileContent.startsWith('data:')) {
      // For image files, fetch the blob from base64
      const response = await fetch(fileContent);
      const blob = await response.blob();
      
      const { data, error } = await supabase
        .storage
        .from('filestorage')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: fileData.type
        });
        
      uploadData = data;
      uploadError = error;
    } else {
      // For other files, upload the content directly
      const { data, error } = await supabase
        .storage
        .from('filestorage')
        .upload(fileName, fileContent, {
          cacheControl: '3600',
          upsert: false,
          contentType: fileData.type
        });
        
      uploadData = data;
      uploadError = error;
    }

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    console.log('File uploaded successfully:', uploadData);
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from('filestorage')
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);

    const now = new Date().toISOString();
    
    // Insert content record with file information
    const { data, error } = await supabase
      .from('original_content')
      .insert({
        id: uuidv4(),
        userId: '00000000-0000-0000-0000-000000000001', // TODO: Replace with actual user ID
        title: inputType + ' to Social Media',
        content_type: inputType,
        content_url: url || publicUrl || "",
        content_text: fileContent,
        file_path: fileName,
        file_type: fileData.type,
        updated_at: now
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return { success: false, error: `Database insert failed: ${error.message}` };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in createOriginalContent:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create content' };
  }
}

export async function listOriginalContent(
  page: number = 1,
  pageSize: number = 5
): Promise<PaginatedResponse<OriginalContent>> {
  try {
    // First, get the total count
    const { count, error: countError } = await supabase
      .from('original_content')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return { data: null, error: new Error(countError.message), count: 0 };
    }

    // Then get the paginated data
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
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (fetchError) {
      return { data: null, error: new Error(fetchError.message), count: 0 };
    }

    return { data, error: null, count: count || 0 };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch content list'),
      count: 0
    };
  }
}

/*
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