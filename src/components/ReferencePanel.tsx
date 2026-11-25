import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { MathText } from './MathText';
import { TopicId } from '../types/math';

interface ReferencePanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface RefCardData {
  title: string;
  equation: string;
  variables: string;
  whenToUse: string;
  example: string;
}

const NATURE_OF_ROOTS_CARDS: RefCardData[] = [
  {
    title: '1. Standard Form of a Quadratic Equation',
    equation: '$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$',
    variables:
      '$a$ is the quadratic coefficient ($x^2$ term), $b$ is the linear coefficient ($x$ term), and $c$ is the constant term.',
    whenToUse:
      'Always rewrite an equation into standard form with $0$ on one side before identifying $a$, $b$, and $c$.',
    example:
      'For $2x^2 = 5x - 3$, rewrite as $2x^2 - 5x + 3 = 0$. Thus $a = 2$, $b = -5$, and $c = 3$.',
  },
  {
    title: '2. The Discriminant Formula',
    equation: '$$D = b^2 - 4ac$$',
    variables:
      '$D$ is the discriminant; $a, b, c$ are the coefficients from standard form $ax^2 + bx + c = 0$.',
    whenToUse:
      'Use whenever you need to determine the number or type of roots without fully solving the quadratic equation. Wrap negative values of $b$ in parentheses before squaring.',
    example:
      'For $x^2 - 4x + 3 = 0$: $a = 1, b = -4, c = 3 \\implies D = (-4)^2 - 4(1)(3) = 16 - 12 = 4$.',
  },
  {
    title: '3. Rules for Determining the Nature of Roots',
    equation:
      '$$D > 0 \\text{ (2 distinct real)} \\quad | \\quad D = 0 \\text{ (2 equal real)} \\quad | \\quad D < 0 \\text{ (2 non-real)}$$',
    variables:
      'The sign of $D$ comes from the radicand $\\sqrt{D}$ inside the quadratic formula $x = \\frac{-b \\pm \\sqrt{D}}{2a}$.',
    whenToUse:
      'Evaluate the sign of $D$ after calculating $b^2 - 4ac$ to classify how many real roots exist.',
    example:
      '$x^2 + 6x + 9 = 0$ gives $D = 6^2 - 4(1)(9) = 0$, so it has two equal real roots ($x = -3$).',
  },
  {
    title: '4. Rational, Irrational, and Non-Real Roots',
    equation:
      '$$D > 0 \\text{ perfect square} \\rightarrow \\text{Rational} \\qquad D > 0 \\text{ non-square} \\rightarrow \\text{Irrational}$$',
    variables:
      'Applies when $a, b, c$ are integers (or rational numbers). A perfect square is $1, 4, 9, 16, 25, 36, \\dots$',
    whenToUse:
      'Use when $D > 0$ to distinguish rational roots (exact integers/fractions) from irrational roots (involving $\\sqrt{\\phantom{x}}$), or when $D < 0$ (non-real roots).',
    example:
      '$D = 25 \\implies \\sqrt{25} = 5$ (two distinct rational roots). $D = 12 \\implies \\sqrt{12}$ is irrational (two distinct irrational roots). $D = -8 < 0$ (two non-real roots).',
  },
];

const QUADRATIC_FUNCTION_CARDS: RefCardData[] = [
  {
    title: '1. Standard Form of a Quadratic Function',
    equation: '$$y = ax^2 + bx + c \\quad (a \\neq 0)$$',
    variables:
      '$a$ controls opening direction ($a > 0$ upward, $a < 0$ downward) and width; $c$ is the $y$-intercept $(0, c)$; axis of symmetry is $x = -\\frac{b}{2a}$.',
    whenToUse:
      'Use as the simplified final form, or when given three general points to build a system of equations for $a, b, c$.',
    example:
      '$y = 2x^2 - 4x + 1$ opens upward ($a = 2 > 0$) and crosses the $y$-axis at $(0, 1)$.',
  },
  {
    title: '2. Vertex Form',
    equation: '$$y = a(x - h)^2 + k$$',
    variables:
      '$(h, k)$ are the coordinates of the vertex (minimum or maximum point), and $a$ is the leading coefficient.',
    whenToUse:
      'Use when the vertex $(h, k)$ (or axis of symmetry $x = h$ and extremum $k$) is known.',
    example:
      '$y = -3(x + 2)^2 + 5$ has vertex $(-2, 5)$ and opens downward ($a = -3$).',
  },
  {
    title: '3. Factored (Intercept) Form',
    equation: '$$y = a(x - r_1)(x - r_2)$$',
    variables:
      '$r_1$ and $r_2$ are the roots ($x$-intercepts) of the function, and $a$ is the leading coefficient.',
    whenToUse:
      'Use when the two roots or $x$-intercepts $(r_1, 0)$ and $(r_2, 0)$ are known.',
    example:
      '$y = 2(x - 1)(x + 4)$ has $x$-intercepts at $x = 1$ and $x = -4$.',
  },
  {
    title: '4. Method: Vertex + Another Point',
    equation: '$$y_1 = a(x_1 - h)^2 + k \\implies a = \\frac{y_1 - k}{(x_1 - h)^2}$$',
    variables:
      '$(h, k)$ is the vertex; $(x_1, y_1)$ is any other point on the parabola with $x_1 \\neq h$.',
    whenToUse:
      'Substitute $(h, k)$ into vertex form, plug in $(x_1, y_1)$ to solve for $a$, then expand if standard form is asked.',
    example:
      'Vertex $(1, -2)$ and point $(3, 6)$: $6 = a(3 - 1)^2 - 2 \\implies 8 = 4a \\implies a = 2$, so $y = 2(x - 1)^2 - 2 = 2x^2 - 4x$.',
  },
  {
    title: '5. Method: Roots + Another Point',
    equation: '$$y_1 = a(x_1 - r_1)(x_1 - r_2)$$',
    variables:
      '$r_1, r_2$ are the roots; $(x_1, y_1)$ is another point on the curve not on the $x$-axis.',
    whenToUse:
      'Substitute $r_1$ and $r_2$ into factored form, plug in $(x_1, y_1)$ to solve for $a$, and expand.',
    example:
      'Roots $-1$ and $3$, point $(0, -6)$: $-6 = a(0 + 1)(0 - 3) = -3a \\implies a = 2$, so $y = 2(x + 1)(x - 3) = 2x^2 - 4x - 6$.',
  },
  {
    title: '6. Method: Using Three Given Points',
    equation: '$$y_i = ax_i^2 + bx_i + c \\quad (i = 1, 2, 3)$$',
    variables:
      '$(x_1, y_1), (x_2, y_2), (x_3, y_3)$ are three distinct points on the parabola.',
    whenToUse:
      'Substitute each point into $y = ax^2 + bx + c$ to create three linear equations. If $(0, c)$ is given, $c$ is found immediately, reducing to two equations in $a$ and $b$.',
    example:
      'Points $(0, 1)$, $(1, 4)$, $(-1, 2)$: $c = 1$; $a + b + 1 = 4 \\implies a + b = 3$; $a - b + 1 = 2 \\implies a - b = 1$. Adding gives $2a = 4 \\implies a = 2, b = 1$, so $y = 2x^2 + x + 1$.',
  },
  {
    title: '7. Method: Reading a Dataset Table of Values',
    equation: '$$\\Delta^2 y = 2a \\quad \\text{(for consecutive } x \\text{ with step } 1\\text{)}$$',
    variables:
      'Symmetry (equal $y$-values at $x_1$ and $x_3$) gives $h = \\frac{x_1 + x_3}{2}$; $y = 0$ gives roots; $x = 0$ gives $c = y$.',
    whenToUse:
      'Scan any $(x, y)$ dataset for matching $y$-values (vertex/symmetry), zero $y$-values (roots), or $x = 0$ ($y$-intercept) before setting up equations.',
    example:
      'If $y = 3$ at both $x = 1$ and $x = 3$, the axis of symmetry is $h = \\frac{1 + 3}{2} = 2$. If $(2, 1)$ is in the table, $(2, 1)$ is the vertex.',
  },
];

export const ReferencePanel: React.FC<ReferencePanelProps> = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<TopicId>('nature_of_roots');

  const cards =
    activeTab === 'nature_of_roots' ? NATURE_OF_ROOTS_CARDS : QUADRATIC_FUNCTION_CARDS;

  return (
    <section
      id="formula-reference"
      className="retro-window mb-6"
      aria-label="Formula and Concept Reference Panel"
    >
      {/* Window Title Bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-[#19283c] border-b-2 border-[#2e435e]">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2.5 text-left font-retro text-sm sm:text-base font-semibold text-[#eef2f6] hover:text-[#4ade80] transition-colors cursor-pointer"
          aria-expanded={isOpen}
        >
          <BookOpen className="w-4 h-4 text-[#4ade80] shrink-0" />
          <span>Formula &amp; Concept Reference</span>
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="retro-btn px-3 py-1 bg-[#121c2a] text-xs font-retro text-[#a5b4c7] hover:text-[#eef2f6] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5">
          {/* Topic Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-[#263a52]">
            <button
              type="button"
              onClick={() => setActiveTab('nature_of_roots')}
              className={`retro-btn px-4 py-2 text-xs sm:text-sm font-retro whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'nature_of_roots'
                  ? 'bg-[#173528] border-[#4ade80] text-[#4ade80] font-semibold'
                  : 'bg-[#0d1520] border-[#2e435e] text-[#a5b4c7] hover:text-[#eef2f6]'
              }`}
            >
              A. Nature of Roots
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quadratic_function')}
              className={`retro-btn px-4 py-2 text-xs sm:text-sm font-retro whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'quadratic_function'
                  ? 'bg-[#173528] border-[#4ade80] text-[#4ade80] font-semibold'
                  : 'bg-[#0d1520] border-[#2e435e] text-[#a5b4c7] hover:text-[#eef2f6]'
              }`}
            >
              B. Quadratic Functions
            </button>
          </div>

          {/* Reference Entries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cards.map((item) => (
              <article
                key={item.title}
                className="retro-inset p-4 flex flex-col gap-2.5"
              >
                <h3 className="font-retro text-sm font-semibold text-[#fbbf24]">
                  {item.title}
                </h3>

                <div className="bg-[#080e16] border border-[#223348] px-3 py-2 text-[#eef2f6]">
                  <MathText content={item.equation} block />
                </div>

                <div className="text-sm text-[#cbd5e1] leading-relaxed space-y-1.5">
                  <p>
                    <span className="font-retro text-xs text-[#7b8ea6] uppercase tracking-wide">
                      Variables:{' '}
                    </span>
                    <MathText content={item.variables} />
                  </p>
                  <p>
                    <span className="font-retro text-xs text-[#7b8ea6] uppercase tracking-wide">
                      When to use:{' '}
                    </span>
                    <MathText content={item.whenToUse} />
                  </p>
                  <p className="pt-1 border-t border-[#1d2d42] text-[#e2e8f0]">
                    <span className="font-retro text-xs text-[#4ade80] uppercase tracking-wide">
                      Example:{' '}
                    </span>
                    <MathText content={item.example} />
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
