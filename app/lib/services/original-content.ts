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
  title: string;
  content: string;
  content_type: string;
  url?: string;
  created_at: string;
  repurposed_content?: {
    id: string;
    output_type: string;
    tone: string;
    content: string;
  }[];
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

export async function listOriginalContent(): Promise<{ data: OriginalContent[] | null; error: Error | null }> {
  try {
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
      return { data: null, error: new Error(fetchError.message) };
    }

    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to fetch content list') 
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