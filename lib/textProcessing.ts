import { removeStopwords } from 'stopword';

export const isContentWord = (word: string): boolean => {
  const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
  if (!cleanWord) return false;
  const words = [cleanWord];
  const filtered = removeStopwords(words);
  return filtered.length > 0;
};

// Split text keeping paragraph structure
export const splitIntoParagraphs = (text: string) => {
  return text.split(/\n\s*\n/).filter(Boolean);
};

// Find the first sentence in a paragraph
export const splitFirstSentence = (paragraph: string) => {
  const match = paragraph.match(/^[^.!?]+[.!?]+\s*/);
  if (!match) return { firstSentence: '', rest: paragraph };
  
  const firstSentence = match[0];
  const rest = paragraph.slice(firstSentence.length);
  return { firstSentence, rest };
};