export type ModuleId = 'lesen' | 'horen' | 'schreiben' | 'sprechen';

export type QuestionType = 'multiple-choice' | 'true-false' | 'matching' | 'fill-blank';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctIndex: number;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  items: string[];
  matches: string[];
  correctPairs: number[]; // index into matches for each item
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  text: string; // text with ___ for blanks
  answer: string;
  alternatives?: string[];
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | MatchingQuestion
  | FillBlankQuestion;

export interface ReadingTask {
  id: string;
  title: string;
  instruction: string;
  text: string;
  questions: (MultipleChoiceQuestion | TrueFalseQuestion)[];
}

export interface ListeningTask {
  id: string;
  title: string;
  instruction: string;
  audioText: string; // text for TTS
  questions: (MultipleChoiceQuestion | TrueFalseQuestion)[];
}

export interface WritingTask {
  id: string;
  title: string;
  instruction: string;
  type: 'email' | 'message' | 'form';
  situation: string;
  points: string[]; // bullet points to cover
  sampleAnswer: string;
  minWords: number;
  maxWords: number;
}

export interface SpeakingTask {
  id: string;
  title: string;
  instruction: string;
  type: 'introduction' | 'topic-card' | 'request';
  prompts: string[];
  sampleAnswer?: string;
  keywords?: string[];
}

export interface ModuleProgress {
  completed: number;
  total: number;
  bestScore: number;
  lastScore: number;
  attempts: number;
}

export interface Progress {
  [key: string]: ModuleProgress;
}
