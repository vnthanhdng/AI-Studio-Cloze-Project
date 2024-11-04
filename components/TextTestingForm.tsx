'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TextTestingFormProps {
  onSubmit: (data: {
    text: string;
    targetWords: string[];
    type: 'ctest' | 'cloze';
  }) => void;
  defaultType?: 'ctest' | 'cloze';
}

export const TextTestingForm: React.FC<TextTestingFormProps> = ({
  onSubmit,
  defaultType = 'ctest'
}) => {
  const [text, setText] = useState('');
  const [targetWordsText, setTargetWordsText] = useState('');
  const [type, setType] = useState<'ctest' | 'cloze'>(defaultType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetWords = targetWordsText
      .split(',')
      .map(word => word.trim().toLowerCase())
      .filter(Boolean);

    onSubmit({
      // Normalize line breaks to ensure consistent behavior
      text: text.replace(/\r\n/g, '\n'),
      targetWords,
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
          Text Content
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[200px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your text here..."
          // Preserve line breaks in textarea
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="targetWords" className="block text-sm font-medium text-gray-700">
          Target Words (comma-separated)
        </label>
        <input
          type="text"
          id="targetWords"
          value={targetWordsText}
          onChange={(e) => setTargetWordsText(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="word1, word2, word3"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Test Type</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="ctest"
              checked={type === 'ctest'}
              onChange={(e) => setType(e.target.value as 'ctest')}
              className="mr-2"
            />
            C-Test
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="cloze"
              checked={type === 'cloze'}
              onChange={(e) => setType(e.target.value as 'cloze')}
              className="mr-2"
            />
            Cloze Test
          </label>
        </div>
      </div>

      <button
        type="submit"
        className={cn(
          "px-4 py-2 bg-blue-500 text-white rounded-md",
          "hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        )}
      >
        Generate Test
      </button>
    </form>
  );
};
