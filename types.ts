export interface InputBoxProps {
    value: string;
    onChange: (value: string) => void;
    isCorrect: boolean;
    showFeedback: boolean;
    size?: 'sm' | 'md' | 'lg';
    onNext?: () => void;
    onPrev?: () => void;
  }
  
  export interface WordProps {
    word: string;
    type?: 'ctest' | 'cloze';
    onComplete?: (completed: boolean) => void;
    showFeedback?: boolean;
    isTarget?: boolean;
    isResetting?: boolean;
    className?: string;
  }
  
  export interface TextTestingComponentProps {
    text: string;
    type?: 'ctest' | 'cloze';
    targetWords?: string[];
    showFeedback?: boolean;
    gapFrequency?: number;
  }

  export interface TestContent {
    text: string;
    targetWords: string[];
    type: 'ctest' | 'cloze';
  }