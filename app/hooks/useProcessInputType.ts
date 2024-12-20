import { useState } from 'react';

interface ProcessInputTypeResult {
  fileContent: string;
  inputType: string;
}

export function useProcessInputType() {
  const [isProcessingInputType, setIsProcessingInputType] = useState(false);
  const [generatedInputType, setGeneratedInputType] = useState<ProcessInputTypeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processInputType = (file: File): Promise<ProcessInputTypeResult> => {
    return new Promise((resolve, reject) => {
      setIsProcessingInputType(true);
      setError(null);

      try {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const fileContent = e.target?.result as string;
            let inputType = 'text';

            // Determine input type based on file type
            if (file.type.startsWith('image/')) {
              inputType = 'image';
            } else if (file.type.startsWith('video/')) {
              inputType = 'video';
            } else if (file.type.startsWith('audio/')) {
              inputType = 'audio';
            }

            const result = {
              fileContent,
              inputType
            };

            setGeneratedInputType(result);
            resolve(result);
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to process file content';
            setError(errorMessage);
            reject(new Error(errorMessage));
          } finally {
            setIsProcessingInputType(false);
          }
        };

        reader.onerror = () => {
          const errorMessage = 'Error reading file';
          setError(errorMessage);
          setIsProcessingInputType(false);
          reject(new Error(errorMessage));
        };

        reader.readAsDataURL(file);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
        setError(errorMessage);
        setIsProcessingInputType(false);
        reject(new Error(errorMessage));
      }
    });
  };

  const processUrlInputType = async (url: string): Promise<ProcessInputTypeResult> => {
    setIsProcessingInputType(true);
    setError(null);

    try {
      // Validate URL
      const validUrl = new URL(url);
      
      // Fetch the URL content
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      // Determine content type from response headers
      const contentType = response.headers.get('content-type') || '';
      let inputType = 'text';

      if (contentType.startsWith('image/')) {
        inputType = 'image';
      } else if (contentType.startsWith('video/')) {
        inputType = 'video';
      } else if (contentType.startsWith('audio/')) {
        inputType = 'audio';
      }

      // Get content based on type
      let fileContent: string;
      if (inputType === 'image') {
        const blob = await response.blob();
        fileContent = URL.createObjectURL(blob);
      } else {
        fileContent = await response.text();
      }

      const result = {
        fileContent,
        inputType
      };

      setGeneratedInputType(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process URL';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessingInputType(false);
    }
  };

  return {
    isProcessingInputType,
    generatedInputType,
    error,
    processInputType,
    processUrlInputType
  };
}