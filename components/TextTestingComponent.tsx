'use client';
import React, { useState } from 'react';
import { TextTestingComponentProps } from '@/types';
import { Word } from './Word';

export const TextTestingComponent: React.FC<TextTestingComponentProps> = ({
    text,
    type = "ctest",
    targetWords = [],
    showFeedback = false
  }) => {
    const words = text.split(/(\s+)/);
    const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  
    const handleWordComplete = (index: number) => {
      setCompletedWords(new Set([...completedWords, index]));
    };
  
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <article className="prose prose-slate prose-p:mt-4 prose-p:mb-4 max-w-none">
          <div className="leading-relaxed space-y-4">
            {words.map((word, index) => (
              word.trim() ? (
                <Word
                  key={index}
                  word={word}
                  type={type}
                  isTarget={targetWords.includes(word.toLowerCase())}
                  onComplete={() => handleWordComplete(index)}
                  showFeedback={showFeedback}
                />
              ) : (
                <span key={index}>{word}</span>
              )
            ))}
          </div>
        </article>
      </div>
    );
  };