import React, { useState, useCallback, useRef } from 'react';
import { TextTestingComponentProps } from '@/types';
import { Word } from './Word';
import { isContentWord, splitIntoParagraphs, splitFirstSentence } from '@/lib/textProcessing';
import { cn } from '@/lib/utils';

export const TextTestingComponent: React.FC<TextTestingComponentProps> = ({
  text, 
  type = 'ctest',
  gapFrequency = 6
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const wordsRef = useRef<Map<string, { checkAnswer: () => boolean }>>(new Map());

  const calculateScore = useCallback(() => {
    let correct = 0;
    let total = 0;

    wordsRef.current.forEach((word) => {
      if (word?.checkAnswer) {
        total++;
        if (word.checkAnswer()) {
          correct++;
        }
      }
    });

    setScore({ correct, total });
  }, []);

  const handleSubmit = () => {
    setShowFeedback(true);
    calculateScore();
  };

  const handleReset = () => {
    setIsResetting(true);
    setShowFeedback(false);
    setScore({ correct: 0, total: 0 });
    wordsRef.current.clear();
    setTimeout(() => setIsResetting(false), 300);
  };

  const processText = (text: string, isFirstSentence: boolean) => {
    const words: { text: string; isTarget: boolean }[] = [];
    let wordCounter = 0;

    const parts = text.split(/(\s+|[.!?,;:])/);

    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part) || /^[.!?,;:]$/.test(part)) {
        words.push({ text: part, isTarget: false });
        return;
      }
      if (part.trim()) {
        const shouldTarget = !isFirstSentence && 
                           isContentWord(part) && 
                           wordCounter % gapFrequency === gapFrequency - 1;
        words.push({ text: part, isTarget: shouldTarget });
        wordCounter++;
      }
    });

    return words;
  };

  const renderWord = (
    wordObj: { text: string; isTarget: boolean },
    pIndex: number,
    wIndex: number,
    section: string
  ) => (
    <Word
      key={`${pIndex}-${section}-${wIndex}`}
      ref={setWordRef(`${pIndex}-${section}-${wIndex}`, wordObj)}
      word={wordObj.text}
      isTarget={wordObj.isTarget}
      showFeedback={showFeedback}
      type={type}
      isResetting={isResetting}
      className={cn(
        // Only show feedback colors after submit is clicked
        showFeedback && wordObj.isTarget && "transition-colors duration-300",
        // No background color until feedback is shown
        !showFeedback && wordObj.isTarget && "bg-gray-100",
        // After submit, show green for correct and red for incorrect
        showFeedback && wordObj.isTarget && "border-2",
        showFeedback && wordObj.isTarget && {
          'bg-green-100 border-green-500': wordsRef.current.get(`${pIndex}-${section}-${wIndex}`)?.checkAnswer(),
          'bg-red-100 border-red-500': !wordsRef.current.get(`${pIndex}-${section}-${wIndex}`)?.checkAnswer()
        }
      )}
    />
  );

  const setWordRef = (key: string, wordObj: { isTarget: boolean }) => (el: { checkAnswer: () => boolean } | null) => {
    if (el && wordObj.isTarget) {
      wordsRef.current.set(key, el);
    }
  };

  const paragraphs = splitIntoParagraphs(text);
  let isFirstParagraphProcessed = false;

  return (
    <div className="space-y-6">
      <div className={cn(
        "p-6 bg-white rounded-lg shadow-sm",
        "transition-opacity duration-300",
        isResetting ? "opacity-50" : "opacity-100"
      )}>
        <article className="prose prose-slate max-w-none">
          {paragraphs.map((paragraph, pIndex) => {
            if (!isFirstParagraphProcessed) {
              isFirstParagraphProcessed = true;
              const { firstSentence, rest } = splitFirstSentence(paragraph);
              
              return (
                <p key={pIndex} className="mb-4">
                  {firstSentence && processText(firstSentence, true).map((wordObj, wIndex) => 
                    renderWord(
                      { ...wordObj, isTarget: false },
                      pIndex,
                      wIndex,
                      'first'
                    )
                  )}
                  {rest && processText(rest, false).map((wordObj, wIndex) =>
                    renderWord(wordObj, pIndex, wIndex, 'rest')
                  )}
                </p>
              );
            }

            return (
              <p key={pIndex} className="mb-4">
                {processText(paragraph, false).map((wordObj, wIndex) =>
                  renderWord(wordObj, pIndex, wIndex, 'normal')
                )}
              </p>
            );
          })}
        </article>
      </div>

      <div className="space-y-4">
        {showFeedback && score.total > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm animate-fade-in">
            <h3 className="text-lg font-medium mb-2">Score</h3>
            <p className="text-gray-700">
              You got <span className="font-bold text-blue-600">{score.correct}</span> out 
              of <span className="font-bold">{score.total}</span> correct 
              ({Math.round((score.correct / score.total) * 100)}%)
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={showFeedback}
            className={cn(
              "flex-1 px-4 py-2 text-white rounded-md",
              "focus:outline-none focus:ring-2",
              "transition-all duration-300",
              showFeedback 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400"
            )}
          >
            Check Answers
          </button>

          <button
            onClick={handleReset}
            className={cn(
              "flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md",
              "hover:bg-gray-200 focus:outline-none focus:ring-2",
              "focus:ring-gray-400 transition-all duration-300"
            )}
          >
            Reset
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};