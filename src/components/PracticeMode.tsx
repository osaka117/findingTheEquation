import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, Shuffle, XCircle } from 'lucide-react';
import {
  DIFFICULTY_META,
  DifficultyLevel,
  MathQuestion,
  PracticeSettings,
  TOPIC_LABELS,
  TopicId,
} from '../types/math';
import { generateUniqueQuestion } from '../utils/questionGenerator';
import { MathText } from './MathText';
import { QuadraticGraph } from './QuadraticGraph';
import { DatasetTable } from './DatasetTable';
import { ExplanationBlock } from './ExplanationBlock';

const STORAGE_KEY = 'quadramath_practice_v3';
const CHOICE_LABELS = ['A', 'B', 'C', 'D'] as const;
const ALL_TOPICS: TopicId[] = ['nature_of_roots', 'quadratic_function'];
const ALL_DIFFS: DifficultyLevel[] = [1, 2, 3, 4, 5];

interface PersistedPractice {
  settings: PracticeSettings;
  question: MathQuestion;
  selectedChoice: number | null;
  recentSignatures: string[];
}

const DEFAULT_SETTINGS: PracticeSettings = {
  selectedTopics: ['nature_of_roots', 'quadratic_function'],
  selectedDifficulties: [1, 2, 3],
  randomTopic: false,
  randomDifficulty: false,
};

function loadInitialPractice(): PersistedPractice {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedPractice;
      if (parsed && parsed.settings && parsed.question && Array.isArray(parsed.question.choices)) {
        return parsed;
      }
    }
  } catch {
    // Ignore malformed storage
  }
  const q = generateUniqueQuestion(
    DEFAULT_SETTINGS.selectedTopics,
    DEFAULT_SETTINGS.selectedDifficulties,
    []
  );
  return {
    settings: DEFAULT_SETTINGS,
    question: q,
    selectedChoice: null,
    recentSignatures: [q.signature],
  };
}

export const PracticeMode: React.FC = () => {
  const [state, setState] = useState<PersistedPractice>(loadInitialPractice);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const { settings, question, selectedChoice, recentSignatures } = state;

  const getActiveTopics = (s: PracticeSettings): TopicId[] =>
    s.randomTopic ? ALL_TOPICS : s.selectedTopics;

  const getActiveDifficulties = (s: PracticeSettings): DifficultyLevel[] =>
    s.randomDifficulty ? ALL_DIFFS : s.selectedDifficulties;

  const spawnNextQuestion = (nextSettings: PracticeSettings = settings) => {
    const nextQ = generateUniqueQuestion(
      getActiveTopics(nextSettings),
      getActiveDifficulties(nextSettings),
      recentSignatures
    );
    const updatedSigs = [nextQ.signature, ...recentSignatures].slice(0, 20);
    setState({
      settings: nextSettings,
      question: nextQ,
      selectedChoice: null,
      recentSignatures: updatedSigs,
    });
  };

  const toggleTopic = (topic: TopicId) => {
    const current = settings.selectedTopics;
    let next: TopicId[];
    if (current.includes(topic)) {
      if (current.length === 1) return; // keep at least one topic selected
      next = current.filter((t) => t !== topic);
    } else {
      next = [...current, topic];
    }
    const nextSettings: PracticeSettings = {
      ...settings,
      randomTopic: false,
      selectedTopics: next,
    };
    spawnNextQuestion(nextSettings);
  };

  const toggleDifficulty = (level: DifficultyLevel) => {
    const current = settings.selectedDifficulties;
    let next: DifficultyLevel[];
    if (current.includes(level)) {
      if (current.length === 1) return; // keep at least one difficulty selected
      next = current.filter((d) => d !== level);
    } else {
      next = [...current, level].sort((a, b) => a - b);
    }
    const nextSettings: PracticeSettings = {
      ...settings,
      randomDifficulty: false,
      selectedDifficulties: next,
    };
    spawnNextQuestion(nextSettings);
  };

  const toggleRandomTopic = () => {
    const nextSettings: PracticeSettings = {
      ...settings,
      randomTopic: !settings.randomTopic,
    };
    spawnNextQuestion(nextSettings);
  };

  const toggleRandomDifficulty = () => {
    const nextSettings: PracticeSettings = {
      ...settings,
      randomDifficulty: !settings.randomDifficulty,
    };
    spawnNextQuestion(nextSettings);
  };

  const handleSelectChoice = (idx: number) => {
    if (selectedChoice !== null) return;
    setState((prev) => ({ ...prev, selectedChoice: idx }));
  };

  const handleRetry = () => {
    setState((prev) => ({ ...prev, selectedChoice: null }));
  };

  const isAnswered = selectedChoice !== null;
  const isCorrect = selectedChoice === question.correctIndex;

  return (
    <div className="space-y-5">
      {/* Control Deck */}
      <div className="retro-window">
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-[#19283c] border-b-2 border-[#2e435e]">
          <h2 className="font-retro text-sm sm:text-base font-semibold text-[#eef2f6]">
            Practice Mode Configuration
          </h2>
          <button
            type="button"
            onClick={() => spawnNextQuestion(settings)}
            className="retro-btn px-3 py-1.5 bg-[#173528] border-[#4ade80] text-[#4ade80] font-retro text-xs font-semibold hover:bg-[#1f4736] whitespace-nowrap shrink-0 cursor-pointer"
          >
            New Question
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Topic Selection */}
          <div className="retro-inset p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-retro text-xs uppercase tracking-wider text-[#a5b4c7]">
                Topics
              </span>
              <button
                type="button"
                onClick={toggleRandomTopic}
                aria-pressed={settings.randomTopic}
                className={`retro-btn px-2.5 py-1 text-xs font-retro flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  settings.randomTopic
                    ? 'bg-[#2a2412] border-[#fbbf24] text-[#fbbf24]'
                    : 'bg-[#121c2a] border-[#2e435e] text-[#a5b4c7] hover:text-[#eef2f6]'
                }`}
              >
                <Shuffle className="w-3 h-3" />
                <span>Random Topic: {settings.randomTopic ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {ALL_TOPICS.map((topicId) => {
                const active = settings.randomTopic || settings.selectedTopics.includes(topicId);
                return (
                  <button
                    key={topicId}
                    type="button"
                    onClick={() => toggleTopic(topicId)}
                    aria-pressed={active}
                    className={`retro-btn px-3.5 py-2 text-xs sm:text-sm font-retro whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#173528] border-[#4ade80] text-[#eef2f6]'
                        : 'bg-[#0b121c] border-[#263a52] text-[#7b8ea6] hover:text-[#cbd5e1]'
                    }`}
                  >
                    {active ? '[x] ' : '[ ] '}
                    {TOPIC_LABELS[topicId]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="retro-inset p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-retro text-xs uppercase tracking-wider text-[#a5b4c7]">
                Difficulty Levels (Grade 10)
              </span>
              <button
                type="button"
                onClick={toggleRandomDifficulty}
                aria-pressed={settings.randomDifficulty}
                className={`retro-btn px-2.5 py-1 text-xs font-retro flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  settings.randomDifficulty
                    ? 'bg-[#2a2412] border-[#fbbf24] text-[#fbbf24]'
                    : 'bg-[#121c2a] border-[#2e435e] text-[#a5b4c7] hover:text-[#eef2f6]'
                }`}
              >
                <Shuffle className="w-3 h-3" />
                <span>Random Level: {settings.randomDifficulty ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ALL_DIFFS.map((lvl) => {
                const active =
                  settings.randomDifficulty || settings.selectedDifficulties.includes(lvl);
                const shortLabel = DIFFICULTY_META[lvl].name.replace('Level ', 'L');
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => toggleDifficulty(lvl)}
                    aria-pressed={active}
                    title={DIFFICULTY_META[lvl].summary}
                    className={`retro-btn px-2.5 py-2 text-xs font-retro whitespace-nowrap shrink-0 cursor-pointer text-center ${
                      active
                        ? 'bg-[#142a3d] border-[#38bdf8] text-[#eef2f6]'
                        : 'bg-[#0b121c] border-[#263a52] text-[#7b8ea6] hover:text-[#cbd5e1]'
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Active Question Terminal */}
      <div className="retro-window">
        <div className="px-4 py-2.5 bg-[#19283c] border-b-2 border-[#2e435e] flex flex-wrap items-center justify-between gap-2">
          <div className="font-retro text-xs sm:text-sm text-[#a5b4c7] flex flex-wrap items-center gap-2">
            <span className="text-[#4ade80] font-semibold">
              {TOPIC_LABELS[question.topic]}
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-[#fbbf24]">{DIFFICULTY_META[question.difficulty].name}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{question.subSkill}</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Prompt + Optional Graph */}
          <div
            className={`grid gap-6 items-start ${
              question.graph ? 'grid-cols-1 lg:grid-cols-[1fr_auto]' : 'grid-cols-1'
            }`}
          >
            <div className="space-y-4">
              <div className="text-base sm:text-lg text-[#eef2f6] leading-relaxed">
                <MathText content={question.prompt} />
              </div>

              {question.dataset && <DatasetTable dataset={question.dataset} />}

              {/* Multiple Choice Answers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {question.choices.map((choice, idx) => {
                  const isThisSelected = selectedChoice === idx;
                  const isThisCorrect = idx === question.correctIndex;

                  let btnStyles =
                    'bg-[#0d1520] border-[#2e435e] text-[#e2e8f0] hover:bg-[#152336] hover:border-[#4b6a91]';
                  if (isAnswered) {
                    if (isThisCorrect) {
                      btnStyles = 'bg-[#0d281c] border-[#4ade80] text-[#eef2f6]';
                    } else if (isThisSelected && !isThisCorrect) {
                      btnStyles = 'bg-[#2c1215] border-[#f87171] text-[#eef2f6]';
                    } else {
                      btnStyles = 'bg-[#0b121c] border-[#1f2e42] text-[#7b8ea6] opacity-75';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectChoice(idx)}
                      className={`retro-btn p-3.5 text-left flex items-start gap-3 min-h-[52px] ${
                        isAnswered ? 'cursor-default' : 'cursor-pointer'
                      } ${btnStyles}`}
                    >
                      <span
                        className={`font-retro text-xs font-bold px-2 py-0.5 border shrink-0 mt-0.5 ${
                          isAnswered && isThisCorrect
                            ? 'bg-[#173528] border-[#4ade80] text-[#4ade80]'
                            : isAnswered && isThisSelected && !isThisCorrect
                              ? 'bg-[#3b151a] border-[#f87171] text-[#f87171]'
                              : 'bg-[#121c2a] border-[#364f6e] text-[#fbbf24]'
                        }`}
                      >
                        {CHOICE_LABELS[idx]}
                      </span>
                      <span className="text-sm sm:text-base leading-snug min-w-0 flex-1">
                        <MathText content={choice} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {question.graph && (
              <div className="flex justify-center lg:justify-end">
                <QuadraticGraph graph={question.graph} />
              </div>
            )}
          </div>

          {/* Immediate Feedback & Step-by-Step Explanation */}
          {isAnswered && (
            <div className="space-y-4 pt-2 border-t-2 border-[#223348]">
              <div
                className={`p-3.5 border-2 flex flex-wrap items-center justify-between gap-3 ${
                  isCorrect
                    ? 'bg-[#0d281c] border-[#4ade80] text-[#eef2f6]'
                    : 'bg-[#2c1215] border-[#f87171] text-[#eef2f6]'
                }`}
                role="status"
              >
                <div className="flex items-center gap-2.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#f87171] shrink-0" />
                  )}
                  <span className="font-retro text-sm font-bold">
                    {isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                  {!isCorrect && (
                    <span className="text-sm text-[#cbd5e1]">
                      &mdash; Correct choice is{' '}
                      <strong className="font-retro text-[#4ade80]">
                        {CHOICE_LABELS[question.correctIndex]}
                      </strong>
                      :{' '}
                      <MathText content={question.choices[question.correctIndex]} />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="retro-btn px-3.5 py-2 bg-[#121c2a] border-[#4b6a91] text-[#eef2f6] text-xs font-retro flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Question</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => spawnNextQuestion(settings)}
                    className="retro-btn px-4 py-2 bg-[#173528] border-[#4ade80] text-[#4ade80] text-xs font-retro font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <ExplanationBlock explanation={question.explanation} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
