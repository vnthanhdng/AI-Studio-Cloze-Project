'use client';
import React from 'react';
import { TextTestingComponentProps } from '@/types';
import { Word } from './Word';
import { isContentWord, splitIntoParagraphs, splitFirstSentence } from '@/lib/textProcessing';

export const TextTestingComponent: React.FC<TextTestingComponentProps> = ({
  text, 
  showFeedback = false,
  type = 'ctest'
}) => {
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
                           wordCounter % 2 === 1;

        words.push({ text: part, isTarget: shouldTarget });
        wordCounter++;
      }
    });

    return words;
  };

  const paragraphs = splitIntoParagraphs(text);
  let isFirstParagraphProcessed = false;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <article className="prose prose-slate max-w-none">
        {paragraphs.map((paragraph, pIndex) => {
          // Special processing for first paragraph in C-test mode
          if (!isFirstParagraphProcessed && type === 'ctest') {
            isFirstParagraphProcessed = true;
            const { firstSentence, rest } = splitFirstSentence(paragraph);
            
            return (
              <p key={pIndex} className="mb-4">
                {firstSentence && processText(firstSentence, true).map((wordObj, wIndex) => (
                  <Word
                    key={`${pIndex}-first-${wIndex}`}
                    word={wordObj.text}
                    isTarget={false}
                    showFeedback={showFeedback}
                    type={type}
                  />
                ))}
                {rest && processText(rest, false).map((wordObj, wIndex) => (
                  <Word
                    key={`${pIndex}-rest-${wIndex}`}
                    word={wordObj.text}
                    isTarget={wordObj.isTarget}
                    showFeedback={showFeedback}
                    type={type}
                  />
                ))}
              </p>
            );
          }

          // Normal processing for other paragraphs
          return (
            <p key={pIndex} className="mb-4">
              {processText(paragraph, false).map((wordObj, wIndex) => (
                <Word
                  key={`${pIndex}-${wIndex}`}
                  word={wordObj.text}
                  isTarget={wordObj.isTarget}
                  showFeedback={showFeedback}
                  type={type}
                />
              ))}
            </p>
          );
        })}
      </article>
    </div>
  );
};


// export const TextTestingComponent: React.FC<TextTestingComponentProps> = ({
//   text,
//   type = "ctest",
//   targetWords = [],
//   showFeedback = false
// }) => {
//   const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());

//   const handleWordComplete = (index: number) => {
//     setCompletedWords(new Set([...completedWords, index]));
//   };

//   // Split text into paragraphs
//   const paragraphs = text.split(/\n/).filter(Boolean);

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-sm">
//       <article className="prose prose-slate max-w-none">
//         {paragraphs.map((paragraph, pIndex) => {
//           // Split each paragraph into words while preserving spaces
//           const words = paragraph.split(/(\s+)/);
          
//           return (
//             <p key={pIndex} className="mb-4">
//               {words.map((word, index) => (
//                 word.trim() ? (
//                   <Word
//                     key={`${pIndex}-${index}`}
//                     word={word}
//                     type={type}
//                     isTarget={targetWords.includes(word.toLowerCase())}
//                     onComplete={() => handleWordComplete(index)}
//                     showFeedback={showFeedback}
//                   />
//                 ) : (
//                   <span key={`${pIndex}-${index}`}>{word}</span>
//                 )
//               ))}
//             </p>
//           );
//         })}
//       </article>
//     </div>
//   );
// };