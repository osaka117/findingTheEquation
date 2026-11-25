export type TopicId = 'nature_of_roots' | 'quadratic_function';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface GraphPoint {
  x: number;
  y: number;
  label: string;
  emphasis?: 'vertex' | 'root' | 'point';
}

export interface QuadraticGraphData {
  a: number;
  b: number;
  c: number;
  points: GraphPoint[];
  caption?: string;
}

export interface QuestionExplanation {
  formulaUsed: string;
  methodReason: string;
  substitution: string;
  calculations: string;
  finalAnswer: string;
}

export interface DatasetPoint {
  x: number;
  y: number;
}

export interface QuadraticDataset {
  xLabel?: string;
  yLabel?: string;
  rows: DatasetPoint[];
  caption?: string;
}

export interface MathQuestion {
  id: string;
  signature: string;
  topic: TopicId;
  difficulty: DifficultyLevel;
  subSkill: string;
  prompt: string;
  dataset?: QuadraticDataset;
  graph?: QuadraticGraphData;
  choices: [string, string, string, string];
  correctIndex: number;
  explanation: QuestionExplanation;
}

export interface PracticeSettings {
  selectedTopics: TopicId[];
  selectedDifficulties: DifficultyLevel[];
  randomTopic: boolean;
  randomDifficulty: boolean;
}

export type MockQuestionCount = 5 | 10 | 15 | 20 | 25 | 30;

export interface MockTestConfig {
  questionCount: MockQuestionCount;
  selectedTopics: TopicId[];
}

export interface MockTestSession {
  config: MockTestConfig;
  questions: MathQuestion[];
  answers: Record<number, number>; // question index -> selected choice index (0..3)
  currentIndex: number;
  submitted: boolean;
  createdAt: number;
}

export const TOPIC_LABELS: Record<TopicId, string> = {
  nature_of_roots: 'Nature of Roots',
  quadratic_function: 'Quadratic Functions',
};

export const DIFFICULTY_META: Record<
  DifficultyLevel,
  { name: string; summary: string }
> = {
  1: { name: 'Level 1 - Basic', summary: 'Forms, coefficients, and discriminant rules' },
  2: { name: 'Level 2 - Easy', summary: 'Direct substitution and single unknowns' },
  3: { name: 'Level 3 - Intermediate', summary: 'Rearranging equations, vertex & root forms' },
  4: { name: 'Level 4 - Challenging', summary: 'Unknown parameter k, 3 points, form conversion' },
  5: { name: 'Level 5 - Difficult', summary: 'Word problems, multi-condition & graph synthesis' },
};
