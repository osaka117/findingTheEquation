import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {
  DIFFICULTY_META,
  DifficultyLevel,
  MockQuestionCount,
  MockTestConfig,
  MockTestSession,
  TOPIC_LABELS,
  TopicId,
} from '../types/math';
import { generateMockTestQuestions } from '../utils/questionGenerator';
import { MathText } from './MathText';
import { QuadraticGraph } from './QuadraticGraph';
import { DatasetTable } from './DatasetTable';
import { ExplanationBlock } from './ExplanationBlock';

const STORAGE_KEY = 'quadramath_mocktest_v3';
const QUESTION_COUNTS: MockQuestionCount[] = [5, 10, 15, 20, 25, 30];
const CHOICE_LABELS = ['A', 'B', 'C', 'D'] as const;
const ALL_TOPICS: TopicId[] = ['nature_of_roots', 'quadratic_function'];

function loadMockSession(): MockTestSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockTestSession;
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return parsed;
    }
  } catch {
    // Ignore malformed storage
  }
  return null;
}

export const MockTestMode: React.FC = () => {
  const [config, setConfig] = useState<MockTestConfig>({
    questionCount: 10,
    selectedTopics: ['nature_of_roots', 'quadratic_function'],
  });
  const [session, setSession] = useState<MockTestSession | null>(loadMockSession);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [reviewIndex, setReviewIndex] = useState<number>(0);

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore quota errors
    }
  }, [session]);

  const toggleTopic = (topic: TopicId) => {
    setConfig((prev) => {
      if (prev.selectedTopics.includes(topic)) {
        if (prev.selectedTopics.length === 1) return prev;
        return { ...prev, selectedTopics: prev.selectedTopics.filter((t) => t !== topic) };
      }
      return { ...prev, selectedTopics: [...prev.selectedTopics, topic] };
    });
  };

  const startMockTest = () => {
    const questions = generateMockTestQuestions(config.questionCount, config.selectedTopics);
    setSession({
      config,
      questions,
      answers: {},
      currentIndex: 0,
      submitted: false,
      createdAt: Date.now(),
    });
    setShowSubmitWarning(false);
    setReviewFilter('all');
    setReviewIndex(0);
  };

  const resetToSetup = () => {
    setSession(null);
    setShowSubmitWarning(false);
  };

  // ============================================================================
  // 1. SETUP SCREEN
  // ============================================================================
  if (!session) {
    return (
      <div className="retro-window">
        <div className="px-4 py-2.5 bg-[#19283c] border-b-2 border-[#2e435e] flex items-center justify-between gap-4">
          <h2 className="font-retro text-sm sm:text-base font-semibold text-[#eef2f6]">
            Create Custom Mock Test
          </h2>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Number of questions */}
            <div className="retro-inset p-4 space-y-3">
              <h3 className="font-retro text-xs uppercase tracking-wider text-[#fbbf24]">
                1. Number of Questions
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {QUESTION_COUNTS.map((cnt) => {
                  const active = config.questionCount === cnt;
                  return (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, questionCount: cnt }))}
                      aria-pressed={active}
                      className={`retro-btn py-2.5 px-2 font-retro text-sm font-semibold cursor-pointer ${
                        active
                          ? 'bg-[#173528] border-[#4ade80] text-[#4ade80]'
                          : 'bg-[#0b121c] border-[#263a52] text-[#a5b4c7] hover:text-[#eef2f6]'
                      }`}
                    >
                      {cnt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic selector */}
            <div className="retro-inset p-4 space-y-3">
              <h3 className="font-retro text-xs uppercase tracking-wider text-[#fbbf24]">
                2. Topics Included
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {ALL_TOPICS.map((topicId) => {
                  const active = config.selectedTopics.includes(topicId);
                  return (
                    <button
                      key={topicId}
                      type="button"
                      onClick={() => toggleTopic(topicId)}
                      aria-pressed={active}
                      className={`retro-btn px-3.5 py-2.5 text-xs sm:text-sm font-retro whitespace-nowrap shrink-0 cursor-pointer ${
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
          </div>

          <div className="retro-inset p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-[#cbd5e1] space-y-1">
              <p className="font-retro text-xs text-[#38bdf8] uppercase">
                Test Generation Rules
              </p>
              <p>
                Difficulty (Levels 1&ndash;5) is randomized independently for each of the{' '}
                <strong className="font-retro text-[#eef2f6]">{config.questionCount}</strong>{' '}
                questions, shuffled without duplicates. You may navigate freely and revise answers
                before submitting.
              </p>
            </div>

            <button
              type="button"
              onClick={startMockTest}
              className="retro-btn px-5 py-3 bg-[#173528] border-[#4ade80] text-[#4ade80] font-retro text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer hover:bg-[#1f4736]"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Start Mock Test</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. SUBMITTED RESULTS & REVIEW SCREEN
  // ============================================================================
  if (session.submitted) {
    const total = session.questions.length;
    const correctCount = session.questions.reduce(
      (acc, q, idx) => (session.answers[idx] === q.correctIndex ? acc + 1 : acc),
      0
    );
    const pct = Math.round((correctCount / total) * 100);

    const filteredIndices = session.questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q, idx }) => {
        const isRight = session.answers[idx] === q.correctIndex;
        if (reviewFilter === 'correct') return isRight;
        if (reviewFilter === 'incorrect') return !isRight;
        return true;
      })
      .map((item) => item.idx);

    const safeReviewIdx = filteredIndices.includes(reviewIndex)
      ? reviewIndex
      : filteredIndices[0] ?? 0;
    const activeReviewQ = session.questions[safeReviewIdx];
    const activeUserAns = session.answers[safeReviewIdx];
    const activeIsCorrect = activeUserAns === activeReviewQ?.correctIndex;

    const topicBreakdown = ALL_TOPICS.map((t) => {
      const qs = session.questions
        .map((q, idx) => ({ q, idx }))
        .filter(({ q }) => q.topic === t);
      const right = qs.filter(({ q, idx }) => session.answers[idx] === q.correctIndex).length;
      return { topic: t, total: qs.length, right };
    }).filter((row) => row.total > 0);

    const diffBreakdown = ([1, 2, 3, 4, 5] as DifficultyLevel[])
      .map((lvl) => {
        const qs = session.questions
          .map((q, idx) => ({ q, idx }))
          .filter(({ q }) => q.difficulty === lvl);
        const right = qs.filter(({ q, idx }) => session.answers[idx] === q.correctIndex).length;
        return { lvl, total: qs.length, right };
      })
      .filter((row) => row.total > 0);

    return (
      <div className="space-y-5">
        {/* Summary Window */}
        <div className="retro-window">
          <div className="px-4 py-2.5 bg-[#19283c] border-b-2 border-[#2e435e] flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-retro text-sm sm:text-base font-semibold text-[#eef2f6]">
              Mock Test Results &amp; Answer Key
            </h2>
            <button
              type="button"
              onClick={resetToSetup}
              className="retro-btn px-3.5 py-1.5 bg-[#173528] border-[#4ade80] text-[#4ade80] font-retro text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Mock Test</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="retro-inset p-4 flex flex-col justify-center">
              <div className="font-retro text-xs uppercase text-[#a5b4c7]">Final Score</div>
              <div className="font-retro text-3xl font-bold text-[#4ade80] mt-1">
                {correctCount} / {total}{' '}
                <span className="text-lg text-[#fbbf24]">({pct}%)</span>
              </div>
              <div className="font-retro text-xs text-[#7b8ea6] mt-1">
                {total - correctCount} incorrect or unanswered
              </div>
            </div>

            <div className="retro-inset p-4 space-y-2">
              <div className="font-retro text-xs uppercase text-[#38bdf8]">By Topic</div>
              {topicBreakdown.map((row) => (
                <div
                  key={row.topic}
                  className="flex items-center justify-between text-xs sm:text-sm font-retro"
                >
                  <span className="text-[#cbd5e1]">{TOPIC_LABELS[row.topic]}</span>
                  <span className="text-[#eef2f6] font-semibold">
                    {row.right} / {row.total}
                  </span>
                </div>
              ))}
            </div>

            <div className="retro-inset p-4 space-y-1.5">
              <div className="font-retro text-xs uppercase text-[#38bdf8]">By Difficulty</div>
              {diffBreakdown.map((row) => (
                <div
                  key={row.lvl}
                  className="flex items-center justify-between text-xs font-retro"
                >
                  <span className="text-[#cbd5e1]">{DIFFICULTY_META[row.lvl].name}</span>
                  <span className="text-[#eef2f6] font-semibold">
                    {row.right} / {row.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question-by-Question Review */}
        <div className="retro-window">
          <div className="px-4 py-2.5 bg-[#19283c] border-b-2 border-[#2e435e] flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-retro text-sm font-semibold text-[#eef2f6]">
              Individual Question Review
            </h3>
            <div className="flex flex-wrap gap-2">
              {(['all', 'incorrect', 'correct'] as const).map((f) => {
                const count =
                  f === 'all'
                    ? total
                    : f === 'correct'
                      ? correctCount
                      : total - correctCount;
                const active = reviewFilter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setReviewFilter(f);
                      const firstMatch = session.questions.findIndex((q, idx) => {
                        const r = session.answers[idx] === q.correctIndex;
                        return f === 'all' ? true : f === 'correct' ? r : !r;
                      });
                      if (firstMatch !== -1) setReviewIndex(firstMatch);
                    }}
                    className={`retro-btn px-3 py-1 text-xs font-retro capitalize whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-[#142a3d] border-[#38bdf8] text-[#eef2f6]'
                        : 'bg-[#0b121c] border-[#263a52] text-[#a5b4c7]'
                    }`}
                  >
                    {f} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            {/* Review question index grid */}
            <div className="flex flex-wrap gap-1.5">
              {session.questions.map((q, idx) => {
                const isRight = session.answers[idx] === q.correctIndex;
                const inFilter = filteredIndices.includes(idx);
                if (!inFilter) return null;
                const isSelected = idx === safeReviewIdx;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setReviewIndex(idx)}
                    className={`retro-btn px-2.5 py-1.5 font-retro text-xs font-semibold cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#fbbf24] bg-[#19283c] text-[#eef2f6] border-[#fbbf24]'
                        : isRight
                          ? 'bg-[#0d281c] border-[#4ade80] text-[#4ade80]'
                          : 'bg-[#2c1215] border-[#f87171] text-[#f87171]'
                    }`}
                  >
                    Q{idx + 1} {isRight ? '✓' : '✗'}
                  </button>
                );
              })}
            </div>

            {filteredIndices.length === 0 ? (
              <div className="retro-inset p-6 text-center font-retro text-sm text-[#a5b4c7]">
                No questions match this filter.
              </div>
            ) : (
              activeReviewQ && (
                <div className="space-y-5 pt-2 border-t border-[#223348]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-retro text-xs sm:text-sm text-[#a5b4c7] flex flex-wrap items-center gap-2">
                      <span className="text-[#eef2f6] font-semibold">
                        Question {safeReviewIdx + 1} of {total}
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span className="text-[#4ade80]">{TOPIC_LABELS[activeReviewQ.topic]}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span className="text-[#fbbf24]">
                        {DIFFICULTY_META[activeReviewQ.difficulty].name}
                      </span>
                    </div>

                    <div
                      className={`px-3 py-1 border font-retro text-xs font-bold flex items-center gap-1.5 ${
                        activeIsCorrect
                          ? 'bg-[#0d281c] border-[#4ade80] text-[#4ade80]'
                          : 'bg-[#2c1215] border-[#f87171] text-[#f87171]'
                      }`}
                    >
                      {activeIsCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {activeUserAns === undefined
                          ? 'UNANSWERED'
                          : activeIsCorrect
                            ? 'CORRECT'
                            : 'INCORRECT'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`grid gap-5 items-start ${
                      activeReviewQ.graph ? 'grid-cols-1 lg:grid-cols-[1fr_auto]' : 'grid-cols-1'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="text-base text-[#eef2f6] leading-relaxed">
                        <MathText content={activeReviewQ.prompt} />
                      </div>

                      {activeReviewQ.dataset && (
                        <DatasetTable dataset={activeReviewQ.dataset} />
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeReviewQ.choices.map((choice, idx) => {
                          const isCorrectChoice = idx === activeReviewQ.correctIndex;
                          const isUserChoice = idx === activeUserAns;
                          return (
                            <div
                              key={idx}
                              className={`p-3 border-2 flex items-start gap-2.5 text-sm ${
                                isCorrectChoice
                                  ? 'bg-[#0d281c] border-[#4ade80] text-[#eef2f6]'
                                  : isUserChoice
                                    ? 'bg-[#2c1215] border-[#f87171] text-[#eef2f6]'
                                    : 'bg-[#0b121c] border-[#1f2e42] text-[#7b8ea6]'
                              }`}
                            >
                              <span className="font-retro text-xs font-bold px-1.5 py-0.5 bg-[#121c2a] border border-[#364f6e] shrink-0">
                                {CHOICE_LABELS[idx]}
                              </span>
                              <div className="flex-1 min-w-0 space-y-1">
                                <MathText content={choice} />
                                {isCorrectChoice && (
                                  <div className="font-retro text-[11px] text-[#4ade80]">
                                    Correct Answer
                                  </div>
                                )}
                                {isUserChoice && !isCorrectChoice && (
                                  <div className="font-retro text-[11px] text-[#f87171]">
                                    Your Answer
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {activeReviewQ.graph && (
                      <div className="flex justify-center lg:justify-end">
                        <QuadraticGraph graph={activeReviewQ.graph} compact />
                      </div>
                    )}
                  </div>

                  <ExplanationBlock explanation={activeReviewQ.explanation} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. ACTIVE MOCK TEST INTERFACE
  // ============================================================================
  const currentQ = session.questions[session.currentIndex];
  const answeredCount = Object.keys(session.answers).length;
  const unansweredCount = session.questions.length - answeredCount;
  const currentChoice = session.answers[session.currentIndex];

  const selectAnswer = (choiceIdx: number) => {
    setSession((prev) =>
      prev
        ? {
            ...prev,
            answers: { ...prev.answers, [prev.currentIndex]: choiceIdx },
          }
        : null
    );
  };

  const goToQuestion = (idx: number) => {
    setSession((prev) => (prev ? { ...prev, currentIndex: idx } : null));
    setShowSubmitWarning(false);
  };

  const handleSubmitAttempt = () => {
    if (unansweredCount > 0 && !showSubmitWarning) {
      setShowSubmitWarning(true);
      return;
    }
    setSession((prev) => (prev ? { ...prev, submitted: true } : null));
    setShowSubmitWarning(false);
  };

  const jumpToFirstUnanswered = () => {
    const firstEmpty = session.questions.findIndex((_, idx) => session.answers[idx] === undefined);
    if (firstEmpty !== -1) {
      goToQuestion(firstEmpty);
    }
  };

  return (
    <div className="space-y-5">
      {/* Test Status & Question Navigator */}
      <div className="retro-window">
        <div className="px-4 py-2.5 bg-[#19283c] border-b-2 border-[#2e435e] flex flex-wrap items-center justify-between gap-3">
          <div className="font-retro text-xs sm:text-sm text-[#eef2f6] flex flex-wrap items-center gap-3">
            <span>
              Question {session.currentIndex + 1} / {session.questions.length}
            </span>
            <span aria-hidden="true" className="text-[#4b6a91]">
              |
            </span>
            <span className="text-[#4ade80]">Answered: {answeredCount}</span>
            <span aria-hidden="true" className="text-[#4b6a91]">
              |
            </span>
            <span className={unansweredCount > 0 ? 'text-[#fbbf24]' : 'text-[#a5b4c7]'}>
              Unanswered: {unansweredCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToSetup}
              className="retro-btn px-3 py-1 bg-[#121c2a] border-[#4b6a91] text-xs font-retro text-[#a5b4c7] hover:text-[#eef2f6] cursor-pointer"
            >
              Exit Test
            </button>
            <button
              type="button"
              onClick={handleSubmitAttempt}
              className="retro-btn px-3.5 py-1 bg-[#173528] border-[#4ade80] text-[#4ade80] text-xs font-retro font-semibold cursor-pointer hover:bg-[#1f4736]"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Question Map */}
        <div className="p-3.5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-retro text-[#7b8ea6]">
            <span>Question Navigator (click any number to jump)</span>
            <span>[*] Answered &middot; [ ] Unanswered</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {session.questions.map((q, idx) => {
              const isAns = session.answers[idx] !== undefined;
              const isCur = idx === session.currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goToQuestion(idx)}
                  aria-current={isCur ? 'step' : undefined}
                  className={`retro-btn px-2.5 py-1.5 font-retro text-xs cursor-pointer ${
                    isCur
                      ? 'bg-[#2a2412] border-[#fbbf24] text-[#fbbf24] font-bold'
                      : isAns
                        ? 'bg-[#173528] border-[#4ade80] text-[#4ade80]'
                        : 'bg-[#0b121c] border-[#2e435e] text-[#a5b4c7] hover:text-[#eef2f6]'
                  }`}
                >
                  {idx + 1}
                  {isAns ? '*' : ''}
                </button>
              );
            })}
          </div>

          {showSubmitWarning && unansweredCount > 0 && (
            <div
              className="mt-3 p-3.5 bg-[#2a210f] border-2 border-[#fbbf24] flex flex-wrap items-center justify-between gap-3"
              role="alert"
            >
              <div className="flex items-center gap-2.5 text-sm text-[#fef3c7]">
                <AlertTriangle className="w-4 h-4 text-[#fbbf24] shrink-0" />
                <span>
                  You still have{' '}
                  <strong className="font-retro text-[#fbbf24]">{unansweredCount}</strong>{' '}
                  unanswered question{unansweredCount === 1 ? '' : 's'}.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={jumpToFirstUnanswered}
                  className="retro-btn px-3 py-1.5 bg-[#121c2a] border-[#fbbf24] text-[#fbbf24] text-xs font-retro cursor-pointer"
                >
                  Jump to Unanswered
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSession((prev) => (prev ? { ...prev, submitted: true } : null))
                  }
                  className="retro-btn px-3 py-1.5 bg-[#173528] border-[#4ade80] text-[#4ade80] text-xs font-retro font-semibold cursor-pointer"
                >
                  Submit Anyway
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Mock Test Question */}
      <div className="retro-window">
        <div className="px-4 py-2.5 bg-[#19283c] border-b-2 border-[#2e435e] flex flex-wrap items-center justify-between gap-2">
          <div className="font-retro text-xs sm:text-sm text-[#a5b4c7] flex flex-wrap items-center gap-2">
            <span className="text-[#4ade80] font-semibold">
              {TOPIC_LABELS[currentQ.topic]}
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-[#fbbf24]">{DIFFICULTY_META[currentQ.difficulty].name}</span>
          </div>
          <span className="font-retro text-xs text-[#7b8ea6]">
            {currentChoice !== undefined
              ? `Selected: ${CHOICE_LABELS[currentChoice]}`
              : 'Not yet answered'}
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div
            className={`grid gap-6 items-start ${
              currentQ.graph ? 'grid-cols-1 lg:grid-cols-[1fr_auto]' : 'grid-cols-1'
            }`}
          >
            <div className="space-y-4">
              <div className="text-base sm:text-lg text-[#eef2f6] leading-relaxed">
                <MathText content={currentQ.prompt} />
              </div>

              {currentQ.dataset && <DatasetTable dataset={currentQ.dataset} />}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.choices.map((choice, idx) => {
                  const isSelected = currentChoice === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectAnswer(idx)}
                      className={`retro-btn p-3.5 text-left flex items-start gap-3 min-h-[52px] cursor-pointer ${
                        isSelected
                          ? 'bg-[#142a3d] border-[#38bdf8] text-[#eef2f6]'
                          : 'bg-[#0d1520] border-[#2e435e] text-[#e2e8f0] hover:bg-[#152336] hover:border-[#4b6a91]'
                      }`}
                    >
                      <span
                        className={`font-retro text-xs font-bold px-2 py-0.5 border shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#1b3b57] border-[#38bdf8] text-[#38bdf8]'
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

            {currentQ.graph && (
              <div className="flex justify-center lg:justify-end">
                <QuadraticGraph graph={currentQ.graph} />
              </div>
            )}
          </div>

          {/* Bottom Prev / Next Controls */}
          <div className="pt-4 border-t border-[#223348] flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={session.currentIndex === 0}
              onClick={() => goToQuestion(session.currentIndex - 1)}
              className="retro-btn px-4 py-2 bg-[#121c2a] border-[#4b6a91] text-xs sm:text-sm font-retro text-[#eef2f6] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {session.currentIndex < session.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => goToQuestion(session.currentIndex + 1)}
                className="retro-btn px-4 py-2 bg-[#142a3d] border-[#38bdf8] text-xs sm:text-sm font-retro text-[#eef2f6] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitAttempt}
                className="retro-btn px-4 py-2 bg-[#173528] border-[#4ade80] text-xs sm:text-sm font-retro font-semibold text-[#4ade80] flex items-center gap-1.5 cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Submit Test</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
