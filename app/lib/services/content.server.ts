'use server';

import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';

type FileData = {
  name: string;
  type: string;
  size: number;
};

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

export async function createRepurposedContent(
  originalContentId: string,
  outputType: string,
  tone: string,
  content: string,
  characterCount: number
) {
  try {
    console.log('Attempting to create repurposed content...');
    
    // First, check if we can access the table
    const { data: testData, error: testError } = await supabase
      .from('repurposed_content')
      .select('*');
    
    if (testError) {
      console.error('Test query error:', testError);
      return { success: false, error: `Test query failed: ${testError.message}` };
    }
    
    const now = new Date().toISOString();
    
    // If we can access the table, try to insert
    const { data, error } = await supabase
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

    if (error) {
      console.error('Insert error:', error);
      return { success: false, error: `Insert failed: ${error.message}` };
    }

    console.log('Repurposed content created successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? `Unexpected error: ${error.message}` : 'Failed to create repurposed content'
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