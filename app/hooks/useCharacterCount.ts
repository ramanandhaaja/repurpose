// hooks/useCharacterCount.ts
import { useState, useEffect } from 'react';

export type OutputType = 'instagram' | 'twitter' | 'linkedin' ;

interface CharacterLimits {
  instagram: number;
  twitter: number;
  linkedin: number;
}

const CHAR_LIMITS: CharacterLimits = {
  instagram: 2200,
  twitter: 280,
  linkedin: 3000,
};

export interface UseCharacterCountReturn {
  characterCount: number;
  isOverLimit: boolean;
  maxCharacters: number;
  updateText: (text: string) => void;
}

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