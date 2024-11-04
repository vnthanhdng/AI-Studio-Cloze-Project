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
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());

  const handleWordComplete = (index: number) => {
    setCompletedWords(new Set([...completedWords, index]));
  };

  // Split text into paragraphs
  const paragraphs = text.split(/\n/).filter(Boolean);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <article className="prose prose-slate max-w-none">
        {paragraphs.map((paragraph, pIndex) => {
          // Split each paragraph into words while preserving spaces
          const words = paragraph.split(/(\s+)/);
          
          return (
            <p key={pIndex} className="mb-4">
              {words.map((word, index) => (
                word.trim() ? (
                  <Word
                    key={`${pIndex}-${index}`}
                    word={word}
                    type={type}
                    isTarget={targetWords.includes(word.toLowerCase())}
                    onComplete={() => handleWordComplete(index)}
                    showFeedback={showFeedback}
                  />
                ) : (
                  <span key={`${pIndex}-${index}`}>{word}</span>
                )
              ))}
            </p>
          );
        })}
      </article>
    </div>
  );
};