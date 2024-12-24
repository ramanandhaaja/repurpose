import { useState, useEffect, useCallback } from 'react';
import { createNewTask, createRegenerateTask, type GeneratedContent } from '@/lib/services/openai-api';

// ===== Types and Interfaces =====
export type OutputType = 'instagram' | 'twitter' | 'linkedin';

export interface FileWithPreview extends File {
  preview?: string;
}

export interface UseUploadReturn {
  files: FileWithPreview[];
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
}

export interface UseCharacterCountReturn {
  characterCount: number;
  isOverLimit: boolean;
  maxCharacters: number;
  updateText: (text: string) => void;
}

interface CharacterLimits {
  instagram: number;
  twitter: number;
  linkedin: number;
}

// ===== Constants =====
const CHAR_LIMITS: CharacterLimits = {
  instagram: 2200,
  twitter: 280,
  linkedin: 3000,
};

// ===== Hooks =====
export const useUpload = (): UseUploadReturn => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((acceptedFiles: File[]) => {
    const processedFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(prev => [...prev, ...processedFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, [processFiles]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview || '');
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach(file => {
      URL.revokeObjectURL(file.preview || '');
    });
    setFiles([]);
  }, [files]);

  return {
    files,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
    clearFiles
  };
};

export const useCharacterCount = (outputType: OutputType): UseCharacterCountReturn => {
  const [characterCount, setCharacterCount] = useState(0);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const maxCharacters = CHAR_LIMITS[outputType];

  const updateText = (text: string) => {
    const count = text.length;
    setCharacterCount(count);
    setIsOverLimit(count > maxCharacters);
  };

  useEffect(() => {
    setIsOverLimit(characterCount > maxCharacters);
  }, [outputType, characterCount, maxCharacters]);

  return {
    characterCount,
    isOverLimit,
    maxCharacters,
    updateText,
  };
};

const useNewTask = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    instagram?: string;
    twitter?: string[];
    linkedin?: string;
  }>();
  const [generatedContentId, setGeneratedContentId] = useState<string | null>(null);
  

  const handleCreateNewTask = async (
    file: File,
    input: string,
    tone: string,
    outputTypes: string[],
    inputType: string,
    url: string,
    useDummyData: boolean
  ) => {
    setIsProcessing(true);
    try {
      const { content, error, originalContentId } = await createNewTask(
        file,
        input,
        tone,
        outputTypes,
        inputType,
        url,
        useDummyData
      );
      
      console.log('Generated content nandha:', content);
      if (error) throw error;
      if (content) {
        setGeneratedContent(prev => ({
          ...prev,
          ...content
        }));
        setGeneratedContentId(originalContentId);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateRegenerateTask = async (
    file: File,
    input: string,
    tone: string,
    outputTypes: string[],
    inputType: string,
    url: string,
    useDummyData: boolean,
    generatedContent: GeneratedContent,
    generatedContentId : string
  ) => {
    setIsProcessing(true);
    try {
      const { content, error } = await createRegenerateTask(
        file,
        input,
        tone,
        outputTypes,
        inputType,
        url,
        useDummyData,
        generatedContent,
        generatedContentId
      );
      
      if (error) throw error;
      if (content) {
        setGeneratedContent(prev => ({
          ...prev,
          ...content
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    generatedContent,
    generatedContentId,
    createNewTask: handleCreateNewTask,
    createRegenerateTask: handleCreateRegenerateTask
  };
};

export default useNewTask;
