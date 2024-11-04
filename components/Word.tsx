import React, { useState, useRef, useEffect } from 'react';
import { WordProps } from '@/types';
import { InputBox } from './InputBox';
import { DisplayBox } from './DisplayBox';

export const Word: React.FC<WordProps> = ({
  word,
  type = "ctest",
  onComplete,
  showFeedback = false,
  isTarget = false
}) => {
  const letters = word.split('');
  const [userInput, setUserInput] = useState<string[]>(Array(letters.length).fill(''));
  const [isCorrect, setIsCorrect] = useState<boolean[]>(Array(letters.length).fill(false));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, letters.length);
  }, [letters.length]);

  const handleLetterChange = (index: number, value: string) => {
    const newInput = [...userInput];
    newInput[index] = value;
    setUserInput(newInput);

    const newIsCorrect = [...isCorrect];
    newIsCorrect[index] = value.toLowerCase() === letters[index].toLowerCase();
    setIsCorrect(newIsCorrect);

    if (newInput.every((letter, idx) => letter.toLowerCase() === letters[idx].toLowerCase())) {
      onComplete?.(true);
    }
  };

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleNext = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < letters.length) {
      focusInput(nextIndex);
    }
  };

  const handlePrev = (currentIndex: number) => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      focusInput(prevIndex);
    }
  };

  // Ref callback to store input references
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  if (!isTarget) {
    return <span className="mx-0.5">{word}</span>;
  }

  const revealedCount = type === "ctest" ? Math.ceil(letters.length / 2) : 0;

  return (
    <span className="inline-flex items-center gap-0.5 mx-0.5">
      {type === "ctest" ? (
        letters.map((letter, index) => (
          index < revealedCount ? (
            <DisplayBox key={index} value={letter} />
          ) : (
            <InputBox
              key={index}
              ref={setInputRef(index)}
              value={userInput[index]}
              onChange={(value) => handleLetterChange(index, value)}
              onNext={() => handleNext(index)}
              onPrev={() => handlePrev(index)}
              isCorrect={isCorrect[index]}
              showFeedback={showFeedback}
            />
          )
        ))
      ) : (
        letters.map((letter, index) => (
          <InputBox
            key={index}
            ref={setInputRef(index)}
            value={userInput[index]}
            onChange={(value) => handleLetterChange(index, value)}
            onNext={() => handleNext(index)}
            onPrev={() => handlePrev(index)}
            isCorrect={isCorrect[index]}
            showFeedback={showFeedback}
          />
        ))
      )}
    </span>
  );
};