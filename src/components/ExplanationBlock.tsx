import React from 'react';
import { QuestionExplanation } from '../types/math';
import { MathText } from './MathText';

interface ExplanationBlockProps {
  explanation: QuestionExplanation;
}

export const ExplanationBlock: React.FC<ExplanationBlockProps> = ({ explanation }) => {
  return (
    <div className="retro-inset p-4 space-y-3 text-sm leading-relaxed text-[#e2e8f0]">
      <h4 className="font-retro text-xs font-semibold uppercase tracking-wider text-[#fbbf24] pb-2 border-b border-[#223348]">
        Step-by-Step Solution
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#091019] border border-[#223348] p-3 space-y-1">
          <div className="font-retro text-xs text-[#38bdf8]">1. Formula / Method Used</div>
          <MathText content={explanation.formulaUsed} className="block text-[#eef2f6]" />
        </div>

        <div className="bg-[#091019] border border-[#223348] p-3 space-y-1">
          <div className="font-retro text-xs text-[#38bdf8]">2. Why This Method Applies</div>
          <MathText content={explanation.methodReason} className="block text-[#cbd5e1]" />
        </div>
      </div>

      <div className="bg-[#091019] border border-[#223348] p-3 space-y-1">
        <div className="font-retro text-xs text-[#38bdf8]">3. Substitution of Values</div>
        <MathText content={explanation.substitution} className="block text-[#eef2f6]" />
      </div>

      <div className="bg-[#091019] border border-[#223348] p-3 space-y-1">
        <div className="font-retro text-xs text-[#38bdf8]">4. Algebraic Calculations</div>
        <MathText content={explanation.calculations} className="block text-[#eef2f6]" />
      </div>

      <div className="bg-[#0d1f18] border border-[#2d6a4f] p-3 flex flex-wrap items-baseline gap-2">
        <span className="font-retro text-xs font-semibold text-[#4ade80] uppercase">
          Final Answer:
        </span>
        <MathText content={explanation.finalAnswer} className="text-[#eef2f6] font-medium" />
      </div>
    </div>
  );
};
