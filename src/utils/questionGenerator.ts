import {
  DifficultyLevel,
  MathQuestion,
  TopicId,
} from '../types/math';
import {
  buildShuffledChoices,
  formatFactoredForm,
  formatFractionLatex,
  formatStandardEquation,
  formatStandardFunctionRational,
  formatStandardPoly,
  formatVertexForm,
  isPerfectSquare,
  parenSigned,
  randChoice,
  randInt,
  randNonZero,
} from './mathFormat';

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `q_${Date.now()}_${idCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

// ============================================================================
// TOPIC A: NATURE OF ROOTS OF A QUADRATIC EQUATION
// ============================================================================

function genNatureLevel1(): MathQuestion {
  const variant = randInt(0, 3);

  if (variant === 0) {
    // Identify coefficients a, b, c (possibly missing term or reordered)
    const a = randNonZero(-5, 5);
    const missingTerm = randChoice(['none', 'b', 'c'] as const);
    const b = missingTerm === 'b' ? 0 : randNonZero(-9, 9);
    const c = missingTerm === 'c' ? 0 : randNonZero(-9, 9);
    const eq = formatStandardEquation(a, b, c);
    const correct = `$a = ${a},\\; b = ${b},\\; c = ${c}$`;

    const candidates = [
      `$a = ${a},\\; b = ${-b === 0 ? c : -b},\\; c = ${-c === 0 ? b : -c}$`,
      `$a = ${a},\\; b = ${c},\\; c = ${b}$`,
      `$a = ${-a},\\; b = ${b},\\; c = ${c}$`,
      `$a = ${a === 1 ? 0 : 1},\\; b = ${b},\\; c = ${c}$`,
      `$a = ${b === 0 ? 1 : b},\\; b = ${a},\\; c = ${c}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `nor-L1-coeff-${a}-${b}-${c}`,
      topic: 'nature_of_roots',
      difficulty: 1,
      subSkill: 'Identifying Coefficients',
      prompt: `Identify the coefficients $a$, $b$, and $c$ of the quadratic equation $${eq}$.`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: `Standard form: $ax^2 + bx + c = 0$, where $a \\neq 0$`,
        methodReason:
          'Match the coefficient of $x^2$ to $a$, the coefficient of $x$ to $b$, and the constant term to $c$. If a term is missing, its coefficient is $0$.',
        substitution: `Comparing $${eq}$ with $ax^2 + bx + c = 0$:`,
        calculations: `Coefficient of $x^2$ is $${a}$; coefficient of $x$ is $${b}$; constant term is $${c}$.`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Identify discriminant formula
    const askType = randChoice(['formula', 'standard_condition'] as const);
    if (askType === 'formula') {
      const correct = '$D = b^2 - 4ac$';
      const candidates = [
        '$D = b^2 + 4ac$',
        '$D = b - 4ac$',
        '$D = \\sqrt{b^2 - 4ac}$',
      ];
      const { choices, correctIndex } = buildShuffledChoices(correct, candidates);
      return {
        id: nextId(),
        signature: 'nor-L1-formula-discriminant',
        topic: 'nature_of_roots',
        difficulty: 1,
        subSkill: 'Discriminant Formula',
        prompt:
          'Which formula is used to calculate the discriminant $D$ of a quadratic equation $ax^2 + bx + c = 0$?',
        choices,
        correctIndex,
        explanation: {
          formulaUsed: '$D = b^2 - 4ac$',
          methodReason:
            'The discriminant is the expression inside the square root of the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$, without the radical sign.',
          substitution: 'Take the radicand from the quadratic formula.',
          calculations: 'Removing the square root gives $D = b^2 - 4ac$.',
          finalAnswer: correct,
        },
      };
    }

    const correct = '$a \\neq 0$';
    const candidates = ['$b \\neq 0$', '$c \\neq 0$', '$a > 0$'];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);
    return {
      id: nextId(),
      signature: 'nor-L1-a-nonzero',
      topic: 'nature_of_roots',
      difficulty: 1,
      subSkill: 'Standard Form Definition',
      prompt:
        'In the standard form of a quadratic equation $ax^2 + bx + c = 0$, which condition must always be true?',
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$ax^2 + bx + c = 0$',
        methodReason:
          'A quadratic equation must have degree $2$. If $a = 0$, the $x^2$ term disappears and the equation becomes linear ($bx + c = 0$).',
        substitution: 'Test $a = 0$: $0 \\cdot x^2 + bx + c = bx + c$.',
        calculations: 'To keep the $x^2$ term present, $a$ can be positive or negative, but never $0$.',
        finalAnswer: correct,
      },
    };
  }

  if (variant === 2) {
    // Recognize nature of roots from a given D
    const kind = randChoice(['pos', 'zero', 'neg'] as const);
    const dVal =
      kind === 'pos'
        ? randChoice([5, 9, 12, 16, 21, 25, 33])
        : kind === 'zero'
          ? 0
          : -randChoice([4, 7, 11, 15, 20, 36]);

    const correct =
      kind === 'pos'
        ? 'Two distinct real roots'
        : kind === 'zero'
          ? 'Two equal real roots'
          : 'Two non-real (imaginary) roots';

    const candidates = [
      'Two distinct real roots',
      'Two equal real roots',
      'Two non-real (imaginary) roots',
      'Only one root and no second root',
    ].filter((c) => c !== correct);

    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `nor-L1-givenD-${dVal}`,
      topic: 'nature_of_roots',
      difficulty: 1,
      subSkill: 'Interpreting the Discriminant',
      prompt: `A quadratic equation has a discriminant of $D = ${dVal}$. What is the nature of its roots?`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$D > 0$: two distinct real roots; $D = 0$: two equal real roots; $D < 0$: two non-real roots',
        methodReason:
          'The sign of the discriminant $D$ determines how many real solutions the quadratic equation has.',
        substitution: `Here, $D = ${dVal}$.`,
        calculations:
          kind === 'pos'
            ? `Since $${dVal} > 0$, $\\sqrt{D}$ is a positive real number, giving two different real roots.`
            : kind === 'zero'
              ? `Since $D = 0$, $\\sqrt{0} = 0$, so both roots equal $-\\frac{b}{2a}$.`
              : `Since $${dVal} < 0$, $\\sqrt{${dVal}}$ is not a real number, producing two non-real roots.`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 3: Standard form recognition
  const a = randNonZero(-4, 4);
  const b = randNonZero(-6, 6);
  const c = randNonZero(-7, 7);
  const correct = `$${formatStandardEquation(a, b, c)}$`;
  const candidates = [
    `$${formatStandardPoly(a, b, 0)} = ${-c}$`,
    `$${a}x^2 = ${formatStandardPoly(0, -b, -c)}$`,
    `$${formatStandardPoly(0, b, c)} = 0$`,
  ];
  const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

  return {
    id: nextId(),
    signature: `nor-L1-stdform-${a}-${b}-${c}`,
    topic: 'nature_of_roots',
    difficulty: 1,
    subSkill: 'Standard Form Recognition',
    prompt: 'Which of the following is a quadratic equation written in standard form?',
    choices,
    correctIndex,
    explanation: {
      formulaUsed: '$ax^2 + bx + c = 0$ with $a \\neq 0$',
      methodReason:
        'Standard form places all terms in descending powers of $x$ on one side and $0$ on the other side, with a non-zero $x^2$ term.',
      substitution: 'Inspect the right-hand side and highest power of $x$ in each choice.',
      calculations: `Only $${formatStandardEquation(a, b, c)}$ has $a = ${a} \\neq 0$ and equals $0$ on the right side.`,
      finalAnswer: correct,
    },
  };
}

function genNatureLevel2(): MathQuestion {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Calculate D by direct substitution (often negative b)
    const a = randNonZero(-3, 4);
    const b = randChoice([-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
    const c = randNonZero(-6, 6);
    const disc = b * b - 4 * a * c;

    const wrong1 = -(b * b) - 4 * a * c; // forgot (-b)^2 is positive
    const wrong2 = b * b + 4 * a * c; // +4ac instead of -4ac
    const wrong3 = b - 4 * a * c; // forgot to square b
    const wrong4 = b * b - 4 * a; // forgot c
    const wrong5 = disc + 4;

    const distractors = Array.from(
      new Set([wrong1, wrong2, wrong3, wrong4, wrong5, disc - 4, disc + 8, -disc].filter((v) => v !== disc))
    )
      .slice(0, 3)
      .map((v) => `$${v}$`);

    const correct = `$${disc}$`;
    const { choices, correctIndex } = buildShuffledChoices(correct, distractors);

    return {
      id: nextId(),
      signature: `nor-L2-calcD-${a}-${b}-${c}`,
      topic: 'nature_of_roots',
      difficulty: 2,
      subSkill: 'Calculating the Discriminant',
      prompt: `Calculate the discriminant $D$ of $${formatStandardEquation(a, b, c)}$.`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$D = b^2 - 4ac$',
        methodReason:
          'Identify $a$, $b$, and $c$ from standard form, then substitute carefully into $D = b^2 - 4ac$ (remember that squaring a negative number gives a positive result).',
        substitution: `Here $a = ${a}$, $b = ${b}$, $c = ${c}$. So $D = ${parenSigned(b)}^2 - 4${parenSigned(a)}${parenSigned(c)}$.`,
        calculations: `$D = ${b * b} - (${4 * a * c}) = ${b * b} ${4 * a * c < 0 ? `+ ${Math.abs(4 * a * c)}` : `- ${4 * a * c}`} = ${disc}$`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Determine nature of roots from a standard equation
    const target = randChoice(['distinct', 'equal', 'nonreal'] as const);
    let a = 1;
    let b = 0;
    let c = 0;

    if (target === 'equal') {
      a = randChoice([1, 2, 3, 4]);
      const r = randNonZero(-5, 5);
      // a(x - r)^2 = ax^2 - 2ar x + ar^2 -> guaranteed D=0
      b = -2 * a * r;
      c = a * r * r;
    } else if (target === 'distinct') {
      a = randNonZero(-2, 3);
      b = randNonZero(-7, 7);
      c = randNonZero(-6, 6);
      while (b * b - 4 * a * c <= 0) {
        c = -Math.abs(c) * Math.sign(a);
        if (b * b - 4 * a * c <= 0) b += 2;
      }
    } else {
      a = randChoice([1, 2, 3]);
      b = randInt(-4, 4);
      c = Math.ceil((b * b) / (4 * a)) + randInt(1, 5);
    }

    const disc = b * b - 4 * a * c;
    const correct =
      disc > 0
        ? 'Two distinct real roots'
        : disc === 0
          ? 'Two equal real roots'
          : 'Two non-real roots';

    const distractors = [
      'Two distinct real roots',
      'Two equal real roots',
      'Two non-real roots',
      'One real and one non-real root',
    ].filter((x) => x !== correct);

    const { choices, correctIndex } = buildShuffledChoices(correct, distractors);

    return {
      id: nextId(),
      signature: `nor-L2-nature-${a}-${b}-${c}`,
      topic: 'nature_of_roots',
      difficulty: 2,
      subSkill: 'Determining Nature of Roots',
      prompt: `Determine the nature of the roots of $${formatStandardEquation(a, b, c)}$.`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$D = b^2 - 4ac$',
        methodReason:
          'Compute the discriminant $D$ and check whether $D > 0$, $D = 0$, or $D < 0$.',
        substitution: `$a = ${a}$, $b = ${b}$, $c = ${c}$, so $D = ${parenSigned(b)}^2 - 4${parenSigned(a)}${parenSigned(c)}$.`,
        calculations: `$D = ${b * b} - (${4 * a * c}) = ${disc}$. ${disc > 0 ? 'Since $D > 0$, there are two distinct real roots.' : disc === 0 ? 'Since $D = 0$, there are two equal real roots.' : 'Since $D < 0$, there are two non-real roots.'}`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 2: Rational vs Irrational roots from given D or equation
  const mode = randChoice(['perfect', 'nonperfect', 'nonreal'] as const);
  const dVal =
    mode === 'perfect'
      ? randChoice([1, 4, 9, 16, 25, 36, 49, 64, 81, 100])
      : mode === 'nonperfect'
        ? randChoice([2, 3, 5, 7, 8, 10, 12, 15, 20, 24, 28])
        : -randChoice([4, 9, 11, 16, 20]);

  const correct =
    mode === 'perfect'
      ? 'Two distinct rational roots'
      : mode === 'nonperfect'
        ? 'Two distinct irrational roots'
        : 'Two non-real roots';

  const distractors = [
    'Two distinct rational roots',
    'Two distinct irrational roots',
    'Two non-real roots',
    'Two equal rational roots',
  ].filter((x) => x !== correct);

  const { choices, correctIndex } = buildShuffledChoices(correct, distractors);

  return {
    id: nextId(),
    signature: `nor-L2-rat-${dVal}`,
    topic: 'nature_of_roots',
    difficulty: 2,
    subSkill: 'Rational vs. Irrational Roots',
    prompt: `A quadratic equation with integer coefficients has discriminant $D = ${dVal}$. How should its roots be classified?`,
    choices,
    correctIndex,
    explanation: {
      formulaUsed:
        'If $D > 0$ is a perfect square $\\rightarrow$ rational roots; if $D > 0$ is not a perfect square $\\rightarrow$ irrational roots; if $D < 0$ $\\rightarrow$ non-real roots.',
      methodReason:
        'In the quadratic formula, $\\sqrt{D}$ simplifies to an integer when $D$ is a perfect square, keeping the roots rational.',
      substitution: `Inspect $D = ${dVal}$.`,
      calculations:
        mode === 'perfect'
          ? `$${dVal} > 0$ and $\\sqrt{${dVal}} = ${Math.round(Math.sqrt(dVal))}$ (a perfect square), so the roots are distinct and rational.`
          : mode === 'nonperfect'
            ? `$${dVal} > 0$, but $${dVal}$ is not a perfect square, so $\\sqrt{${dVal}}$ stays irrational, producing two distinct irrational roots.`
            : `$${dVal} < 0$, so $\\sqrt{${dVal}}$ is not real, giving two non-real roots.`,
      finalAnswer: correct,
    },
  };
}

function genNatureLevel3(): MathQuestion {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Rearrange first, then determine full nature (rational/irrational/equal/nonreal)
    const outcome = randChoice(['rational', 'irrational', 'equal', 'nonreal'] as const);
    let a = randChoice([1, 2, 3]);
    let b = 0;
    let c = 0;

    if (outcome === 'equal') {
      const r = randNonZero(-4, 4);
      b = -2 * a * r;
      c = a * r * r;
    } else if (outcome === 'rational') {
      // Construct integer roots r1 != r2
      const r1 = randInt(-4, 4);
      let r2 = randInt(-4, 4);
      while (r2 === r1) r2 = randInt(-4, 4);
      b = -a * (r1 + r2);
      c = a * r1 * r2;
    } else if (outcome === 'irrational') {
      a = randChoice([1, 2]);
      b = randNonZero(-5, 5);
      c = randNonZero(-5, 5);
      let d = b * b - 4 * a * c;
      while (d <= 0 || isPerfectSquare(d)) {
        c = randNonZero(-5, 5);
        b = randNonZero(-5, 5);
        d = b * b - 4 * a * c;
      }
    } else {
      a = randChoice([1, 2, 3]);
      b = randNonZero(-5, 5);
      c = Math.ceil((b * b) / (4 * a)) + randInt(1, 4);
    }

    const disc = b * b - 4 * a * c;
    // Present rearranged: ax^2 + bx = -c OR ax^2 = -bx - c
    const rearrangeStyle = randChoice([0, 1]);
    const rearrangedEq =
      rearrangeStyle === 0
        ? `${formatStandardPoly(a, b, 0)} = ${-c}`
        : `${formatStandardPoly(a, 0, 0)} = ${formatStandardPoly(0, -b, -c)}`;

    const natureText =
      disc < 0
        ? 'two non-real roots'
        : disc === 0
          ? 'two equal real roots'
          : isPerfectSquare(disc)
            ? 'two distinct rational roots'
            : 'two distinct irrational roots';

    const correct = `$D = ${disc}$; ${natureText}`;
    const allNatures = [
      'two distinct rational roots',
      'two distinct irrational roots',
      'two equal real roots',
      'two non-real roots',
    ];
    const wrongDisc = b * b + 4 * a * c;
    const candidates = [
      `$D = ${wrongDisc === disc ? disc + 8 : wrongDisc}$; ${allNatures.find((n) => n !== natureText)!}`,
      `$D = ${disc}$; ${allNatures.filter((n) => n !== natureText)[0]}`,
      `$D = ${disc}$; ${allNatures.filter((n) => n !== natureText)[1]}`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `nor-L3-rearr-${a}-${b}-${c}-${rearrangeStyle}`,
      topic: 'nature_of_roots',
      difficulty: 3,
      subSkill: 'Rearranging & Full Classification',
      prompt: `Rewrite $${rearrangedEq}$ in standard form, calculate the discriminant, and classify the roots.`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: `Standard form $ax^2 + bx + c = 0$, then $D = b^2 - 4ac$`,
        methodReason:
          'Always move all terms to one side so the right side is $0$ before identifying $a$, $b$, and $c$.',
        substitution: `Rewriting gives $${formatStandardEquation(a, b, c)}$, so $a = ${a}$, $b = ${b}$, $c = ${c}$.`,
        calculations: `$D = ${parenSigned(b)}^2 - 4${parenSigned(a)}${parenSigned(c)} = ${b * b} - (${4 * a * c}) = ${disc}$. ${
          disc < 0
            ? 'Since $D < 0$, the roots are non-real.'
            : disc === 0
              ? 'Since $D = 0$, there are two equal real roots.'
              : isPerfectSquare(disc)
                ? `Since $D = ${disc} > 0$ is a perfect square, the roots are distinct and rational.`
                : `Since $D = ${disc} > 0$ is not a perfect square, the roots are distinct and irrational.`
        }`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Expanded product form like x(ax + b) = c
    const a = randChoice([1, 2, 3]);
    const b = randNonZero(-6, 6);
    const rhs = randNonZero(-6, 6);
    const c = -rhs;
    const disc = b * b - 4 * a * c;

    const lhs = a === 1 ? `x(x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`})` : `x(${a}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`})`;
    const correct = `$${disc}$`;
    const distractors = Array.from(
      new Set(
        [
          b * b - 4 * a * rhs,
          b * b + 4 * a * c,
          -(b * b) - 4 * a * c,
          disc + 4,
          disc - 4,
          disc + 8,
          -disc,
        ].filter((v) => v !== disc)
      )
    )
      .slice(0, 3)
      .map((v) => `$${v}$`);

    const { choices, correctIndex } = buildShuffledChoices(correct, distractors);

    return {
      id: nextId(),
      signature: `nor-L3-expand-${a}-${b}-${rhs}`,
      topic: 'nature_of_roots',
      difficulty: 3,
      subSkill: 'Multi-Step Discriminant',
      prompt: `Find the discriminant of $${lhs} = ${rhs}$.`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: `$D = b^2 - 4ac$`,
        methodReason:
          'Expand the parentheses and move all terms to the left side to obtain standard form $ax^2 + bx + c = 0$.',
        substitution: `Expanding gives $${formatStandardPoly(a, b, 0)} = ${rhs}$, so $${formatStandardEquation(a, b, c)}$.`,
        calculations: `With $a = ${a}$, $b = ${b}$, $c = ${c}$: $D = ${parenSigned(b)}^2 - 4(${a})(${c}) = ${b * b} - (${4 * a * c}) = ${disc}$.`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 2: Find missing constant c given D
  const a = randChoice([1, 2, 3]);
  const b = randNonZero(-6, 6);
  const c = randNonZero(-6, 6);
  const disc = b * b - 4 * a * c;

  const correct = `$c = ${c}$`;
  const distractors = Array.from(
    new Set(
      [-c, c + 2, c - 2, c + 1, c - 1, c + 4, Math.round((b * b + disc) / (4 * a))].filter(
        (v) => v !== c
      )
    )
  )
    .slice(0, 3)
    .map((v) => `$c = ${v}$`);

  const { choices, correctIndex } = buildShuffledChoices(correct, distractors);

  return {
    id: nextId(),
    signature: `nor-L3-findc-${a}-${b}-${c}`,
    topic: 'nature_of_roots',
    difficulty: 3,
    subSkill: 'Solving with the Discriminant',
    prompt: `The discriminant of $${formatStandardPoly(a, b, 0)} + c = 0$ is $D = ${disc}$. What is the value of $c$?`,
    choices,
    correctIndex,
    explanation: {
      formulaUsed: '$D = b^2 - 4ac$',
      methodReason: 'Substitute the known values of $a$, $b$, and $D$, then solve the linear equation for $c$.',
      substitution: `$${disc} = ${parenSigned(b)}^2 - 4(${a})c$`,
      calculations: `$${disc} = ${b * b} - ${4 * a}c \\implies ${4 * a}c = ${b * b - disc} \\implies c = ${c}$`,
      finalAnswer: correct,
    },
  };
}

function genNatureLevel4(): MathQuestion {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Find k in ax^2 + kx + c = 0 for two equal real roots -> k = +- 2*sqrt(ac)
    const pairs: Array<[number, number, number]> = [
      [1, 4, 4],
      [1, 9, 6],
      [1, 16, 8],
      [1, 25, 10],
      [4, 1, 4],
      [4, 9, 12],
      [2, 8, 8],
      [3, 12, 12],
      [2, 18, 12],
    ];
    const [a, c, kAbs] = randChoice(pairs);
    const correct = `$k = ${kAbs}$ or $k = -${kAbs}$`;
    const candidates = [
      `$k = ${kAbs}$ only`,
      `$k = ${kAbs * 2}$ or $k = -${kAbs * 2}$`,
      `$k = ${Math.max(1, Math.round(kAbs / 2))}$ or $k = -${Math.max(1, Math.round(kAbs / 2))}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `nor-L4-keq-${a}-${c}`,
      topic: 'nature_of_roots',
      difficulty: 4,
      subSkill: 'Unknown Linear Coefficient',
      prompt: `For what value(s) of $k$ does $${a === 1 ? '' : a}x^2 + kx + ${c} = 0$ have two equal real roots?`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: 'Two equal real roots $\\iff D = b^2 - 4ac = 0$',
        methodReason:
          'Set the discriminant equal to $0$, then solve for $k$. Taking the square root yields both a positive and negative solution.',
        substitution: `With $a = ${a}$, $b = k$, $c = ${c}$: $k^2 - 4(${a})(${c}) = 0$.`,
        calculations: `$k^2 - ${4 * a * c} = 0 \\implies k^2 = ${kAbs * kAbs} \\implies k = \\pm ${kAbs}$.`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Inequality range for k: x^2 + bx + k = 0 has two distinct real roots OR two non-real roots
    const p = randNonZero(-5, 5);
    const b = 2 * p;
    const kBound = p * p;
    const askReal = randChoice([true, false]);

    const correct = askReal ? `$k < ${kBound}$` : `$k > ${kBound}$`;
    const candidates = [
      askReal ? `$k > ${kBound}$` : `$k < ${kBound}$`,
      askReal ? `$k \\le ${kBound}$` : `$k \\ge ${kBound}$`,
      askReal ? `$k < ${-kBound}$` : `$k > ${-kBound}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `nor-L4-ineq-${b}-${askReal}`,
      topic: 'nature_of_roots',
      difficulty: 4,
      subSkill: 'Parameter Range via Discriminant',
      prompt: `For what values of $k$ does $x^2 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x + k = 0$ have ${askReal ? 'two distinct real roots' : 'two non-real roots'}?`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: askReal
          ? 'Two distinct real roots $\\iff D = b^2 - 4ac > 0$'
          : 'Two non-real roots $\\iff D = b^2 - 4ac < 0$',
        methodReason:
          'Express $D$ in terms of $k$ and solve the resulting linear inequality.',
        substitution: `$a = 1$, $b = ${b}$, $c = k \\implies D = ${parenSigned(b)}^2 - 4(1)(k) ${askReal ? '> 0' : '< 0'}$.`,
        calculations: `$${b * b} - 4k ${askReal ? '> 0' : '< 0'} \\implies ${b * b} ${askReal ? '>' : '<'} 4k \\implies k ${askReal ? '<' : '>'} ${kBound}$.`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 2: Find k in constant term for equal roots: ax^2 + bx + k = 0
  const a = randChoice([1, 2, 3, 4]);
  const m = randNonZero(-4, 4);
  const b = 2 * a * m;
  const kExact = a * m * m;

  const correct = `$k = ${kExact}$`;
  const distractors = Array.from(
    new Set(
      [-kExact, kExact + a, kExact - a, kExact + 2, kExact * 2, b * b].filter((v) => v !== kExact)
    )
  )
    .slice(0, 3)
    .map((v) => `$k = ${v}$`);

  const { choices, correctIndex } = buildShuffledChoices(correct, distractors);

  return {
    id: nextId(),
    signature: `nor-L4-constk-${a}-${b}`,
    topic: 'nature_of_roots',
    difficulty: 4,
    subSkill: 'Solving for Constant Parameter',
    prompt: `Find the value of $k$ so that $${formatStandardPoly(a, b, 0)} + k = 0$ has two equal real roots.`,
    choices,
    correctIndex,
    explanation: {
      formulaUsed: '$D = b^2 - 4ac = 0$',
      methodReason: 'Equal real roots occur only when the discriminant equals $0$.',
      substitution: `Here $a = ${a}$, $b = ${b}$, $c = k$: $${parenSigned(b)}^2 - 4(${a})k = 0$.`,
      calculations: `$${b * b} - ${4 * a}k = 0 \\implies ${4 * a}k = ${b * b} \\implies k = ${kExact}$.`,
      finalAnswer: correct,
    },
  };
}

function genNatureLevel5(): MathQuestion {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Projectile height feasibility problem: h(t) = -5t^2 + v0*t + h0
    const scenarios = [
      { v0: 20, h0: 2, targetH: 25, reach: 'cannot reach' }, // -5t^2 + 20t - 23 = 0 -> D = 400 - 460 = -60 < 0
      { v0: 20, h0: 5, targetH: 25, reach: 'reaches once (max height)' }, // -5t^2 + 20t - 20 = 0 -> D = 0
      { v0: 20, h0: 5, targetH: 20, reach: 'reaches twice' }, // -5t^2 + 20t - 15 = 0 -> D = 100 > 0
      { v0: 30, h0: 1, targetH: 50, reach: 'cannot reach' }, // -5t^2 + 30t - 49 = 0 -> D = 900 - 980 = -80 < 0
      { v0: 30, h0: 5, targetH: 50, reach: 'reaches once (max height)' }, // D = 0
      { v0: 30, h0: 5, targetH: 40, reach: 'reaches twice' }, // -5t^2 + 30t - 35 = 0 -> D = 200 > 0
    ];
    const sc = randChoice(scenarios);
    const c = sc.h0 - sc.targetH;
    const disc = sc.v0 * sc.v0 - 4 * -5 * c;

    const correct =
      disc < 0
        ? `No, because $D = ${disc} < 0$ (no real solutions for $t$)`
        : disc === 0
          ? `Yes, exactly once at its peak, because $D = 0$`
          : `Yes, twice (going up and coming down), because $D = ${disc} > 0$`;

    const allOptions = [
      `No, because $D = ${disc} < 0$ (no real solutions for $t$)`,
      `Yes, exactly once at its peak, because $D = 0$`,
      `Yes, twice (going up and coming down), because $D = ${disc} > 0$`,
      `No, because $D = ${Math.abs(disc) + 20} > 0$`,
      `Yes, because $a = -5 < 0$ always reaches any positive height`,
    ].filter((o) => o !== correct);

    const { choices, correctIndex } = buildShuffledChoices(correct, allOptions.slice(0, 3));

    return {
      id: nextId(),
      signature: `nor-L5-proj-${sc.v0}-${sc.h0}-${sc.targetH}`,
      topic: 'nature_of_roots',
      difficulty: 5,
      subSkill: 'Applied Discriminant Problem',
      prompt: `A ball is thrown upward and its height (in meters) after $t$ seconds is modeled by $h(t) = -5t^2 + ${sc.v0}t + ${sc.h0}$. Using the discriminant, can the ball reach a height of $${sc.targetH}$ meters?`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: `Set $h(t) = ${sc.targetH}$, then compute $D = b^2 - 4ac$`,
        methodReason:
          'Whether the ball reaches height $H$ depends on whether $-5t^2 + v_0 t + h_0 = H$ has real solutions for $t$.',
        substitution: `$-5t^2 + ${sc.v0}t + ${sc.h0} = ${sc.targetH} \\implies -5t^2 + ${sc.v0}t ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0$.`,
        calculations: `Here $a = -5$, $b = ${sc.v0}$, $c = ${c}$, so $D = (${sc.v0})^2 - 4(-5)(${c}) = ${sc.v0 * sc.v0} ${20 * c >= 0 ? `+ ${20 * c}` : `- ${Math.abs(20 * c)}`} = ${disc}$.`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Parameter k in leading coefficient: (k + p)x^2 + 2(k + q)x + (k + r) = 0 -> k^2 cancels!
    const validTuples: Array<[number, number, number, number]> = [];
    for (let p = -3; p <= 3; p++) {
      for (let q = -3; q <= 3; q++) {
        for (let r = -3; r <= 3; r++) {
          const denom = 2 * q - p - r;
          const num = p * r - q * q;
          if (denom !== 0 && num % denom === 0) {
            const k = num / denom;
            if (k + p !== 0 && Math.abs(k) <= 8 && (p !== q || q !== r)) {
              validTuples.push([p, q, r, k]);
            }
          }
        }
      }
    }
    const [p, q, r, kSol] = randChoice(validTuples);
    const fmtShift = (v: number) =>
      v === 0 ? 'k' : v > 0 ? `(k + ${v})` : `(k - ${Math.abs(v)})`;

    const eqStr = `${fmtShift(p)}x^2 + ${2}${fmtShift(q)}x + ${fmtShift(r)} = 0`;
    const correct = `$k = ${kSol}$`;
    const distractors = Array.from(
      new Set(
        [-kSol, kSol + 1, kSol - 2, kSol + 2, kSol - 1, kSol + 3, -p].filter(
          (v) => v !== kSol
        )
      )
    )
      .slice(0, 3)
      .map((v) => `$k = ${v}$`);

    const { choices, correctIndex } = buildShuffledChoices(correct, distractors);
    const denom = 2 * q - p - r;
    const cTerm = q * q - p * r;

    return {
      id: nextId(),
      signature: `nor-L5-param-${p}-${q}-${r}`,
      topic: 'nature_of_roots',
      difficulty: 5,
      subSkill: 'Multi-Term Parameter Equation',
      prompt: `Find the value of $k$ (with $a \\neq 0$) for which $${eqStr}$ has two equal real roots.`,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: `$D = b^2 - 4ac = 0$`,
        methodReason:
          'Substitute the expressions for $a$, $b$, and $c$ into $D = 0$. The $k^2$ terms cancel out, leaving a linear equation in $k$.',
        substitution: `$a = ${fmtShift(p)}$, $b = 2${fmtShift(q)}$, $c = ${fmtShift(r)}$. So $D = 4${fmtShift(q)}^2 - 4${fmtShift(p)}${fmtShift(r)} = 0$.`,
        calculations: `Dividing by $4$: $(k ${q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`})^2 - (k ${p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`})(k ${r >= 0 ? `+ ${r}` : `- ${Math.abs(r)}`}) = 0 \\implies ${denom}k ${cTerm >= 0 ? `+ ${cTerm}` : `- ${Math.abs(cTerm)}`} = 0 \\implies k = ${kSol}$ (and $a = ${kSol + p} \\neq 0$).`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 2: Rectangle perimeter/area feasibility
  const halfP = randChoice([10, 12, 14, 16, 18, 20]); // P = 2 * halfP
  const P = 2 * halfP;
  const maxArea = (halfP / 2) * (halfP / 2);
  const offset = randChoice([-9, -5, 0, 4, 8]);
  const area = maxArea + offset;
  // w(halfP - w) = area -> w^2 - halfP*w + area = 0
  const disc = halfP * halfP - 4 * area;

  const correct =
    disc > 0
      ? `Yes, two different rectangles work ($D = ${disc} > 0$)`
      : disc === 0
        ? `Yes, one unique square works ($D = 0$)`
        : `No, it is impossible ($D = ${disc} < 0$)`;

  const candidates = [
    `Yes, two different rectangles work ($D = ${disc} > 0$)`,
    `Yes, one unique square works ($D = 0$)`,
    `No, it is impossible ($D = ${disc} < 0$)`,
    `Yes, infinitely many rectangles work ($D = ${Math.abs(disc)}$)`,
  ].filter((c) => c !== correct);

  const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

  return {
    id: nextId(),
    signature: `nor-L5-rect-${P}-${area}`,
    topic: 'nature_of_roots',
    difficulty: 5,
    subSkill: 'Geometric Feasibility',
    prompt: `A student has $${P}\\text{ m}$ of fencing to enclose a rectangular garden with area $${area}\\text{ m}^2$. Using $w(${halfP} - w) = ${area}$, what does the discriminant tell us?`,
    choices,
    correctIndex,
    explanation: {
      formulaUsed: `Standard form $w^2 - ${halfP}w + ${area} = 0$, then $D = b^2 - 4ac$`,
      methodReason:
        'Rearrange the area equation into standard quadratic form and check the sign of $D$ to see if real widths $w$ exist.',
      substitution: `$w^2 - ${halfP}w + ${area} = 0 \\implies a = 1$, $b = -${halfP}$, $c = ${area}$.`,
      calculations: `$D = (-${halfP})^2 - 4(1)(${area}) = ${halfP * halfP} - ${4 * area} = ${disc}$.`,
      finalAnswer: correct,
    },
  };
}

// ============================================================================
// TOPIC B: DETERMINING THE EQUATION OF A QUADRATIC FUNCTION (DATASET-DRIVEN)
// ============================================================================

function genQuadLevel1(): MathQuestion {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Centered at x = 0 with a = +-1: y = a*x^2 + k
    const a = randChoice([-1, 1]);
    const k = randNonZero(-5, 5);
    const xs = [-2, -1, 0, 1, 2];
    const rows = xs.map((x) => ({ x, y: a * x * x + k }));

    const correct = `$y = ${formatStandardPoly(a, 0, k)}$`;
    const candidates = [
      `$y = ${formatStandardPoly(-a, 0, k)}$`,
      `$y = ${formatStandardPoly(a, 0, -k)}$`,
      `$y = ${formatStandardPoly(a > 0 ? 2 : -2, 0, k)}$`,
      `$y = ${formatStandardPoly(a, 1, k)}$`,
      `$y = ${formatStandardPoly(a, 0, k + 2)}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `qf-L1-ds-center0-${a}-${k}`,
      topic: 'quadratic_function',
      difficulty: 1,
      subSkill: 'Dataset to Equation (Centered Vertex)',
      prompt:
        'Find the equation $y = ax^2 + bx + c$ of the quadratic function represented by the dataset below.',
      dataset: { rows },
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = a(x - h)^2 + k = ax^2 + bx + c$ (here $h = 0$ and $b = 0$)',
        methodReason:
          `Notice that $y$ has equal values at $x = -1$ and $x = 1$ (and at $x = -2$ and $x = 2$), so the vertex is centered at $(0, ${k})$. Substitute $(0, ${k})$ and $(1, ${a + k})$ to find $a$.`,
        substitution: `With vertex $(0, ${k})$, $y = ax^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}$. Using $(1, ${a + k})$: $${a + k} = a(1)^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}$.`,
        calculations: `$a = ${a + k} - (${k}) = ${a}$, giving $y = ${formatStandardPoly(a, 0, k)}$.`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Symmetric table around vertex (h, k) with a = +-1 -> y = ax^2 + bx + c
    const a = randChoice([-1, 1]);
    const h = randNonZero(-4, 4);
    const k = randNonZero(-5, 5);
    const b = -2 * a * h;
    const c = a * h * h + k;
    const xs = [h - 2, h - 1, h, h + 1, h + 2];
    const rows = xs.map((x) => ({ x, y: a * (x - h) * (x - h) + k }));

    const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
    const candidates = [
      `$y = ${formatStandardPoly(a, -b, c)}$`,
      `$y = ${formatStandardPoly(-a, -b, a * h * h + k)}$`,
      `$y = ${formatStandardPoly(a, b, k)}$`,
      `$y = ${formatStandardPoly(a > 0 ? 2 : -2, b, c)}$`,
      `$y = ${formatStandardPoly(a, b + 2, c - 1)}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `qf-L1-ds-vertex-${a}-${h}-${k}`,
      topic: 'quadratic_function',
      difficulty: 1,
      subSkill: 'Symmetric Dataset to Standard Form',
      prompt:
        'Use the symmetry in the dataset below to find the quadratic equation in the form $y = ax^2 + bx + c$.',
      dataset: { rows },
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = a(x - h)^2 + k \\rightarrow y = ax^2 + bx + c$',
        methodReason:
          `Because $y$ has matching values at $x = ${h - 1}$ and $x = ${h + 1}$, the middle point $(${h}, ${k})$ is the vertex $(h, k)$.`,
        substitution: `Set $h = ${h}$ and $k = ${k}$. Plug in $(${h + 1}, ${a + k})$: $${a + k} = a(${h + 1} ${h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}$.`,
        calculations: `$a = ${a}$, giving $${formatVertexForm(a, 1, h, k, 'y')}$. Expanding gives $y = ${formatStandardPoly(a, b, c)}$.`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 2: Table showing two x-intercepts and other points with a = +-1 -> y = ax^2 + bx + c
  const a = randChoice([-1, 1]);
  const r1 = randInt(-4, 0);
  const r2 = r1 + randInt(2, 4);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const extra1 = r1 - 1;
  const extra2 = r1 + 1;
  const xs = Array.from(new Set([extra1, r1, extra2, r2, r2 + 1])).sort((u, v) => u - v);
  const rows = xs.map((x) => ({ x, y: a * (x - r1) * (x - r2) }));

  const pt = rows.find((p) => p.x !== r1 && p.x !== r2)!;
  const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
  const candidates = [
    `$y = ${formatStandardPoly(a, -b, c)}$`,
    `$y = ${formatStandardPoly(-a, -b, -c)}$`,
    `$y = ${formatStandardPoly(a > 0 ? 2 : -2, b * 2, c * 2)}$`,
    `$y = ${formatStandardPoly(a, b, -c)}$`,
    `$y = ${formatStandardPoly(a, b + 2, c - 1)}$`,
  ];
  const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

  return {
    id: nextId(),
    signature: `qf-L1-ds-roots-${a}-${r1}-${r2}`,
    topic: 'quadratic_function',
    difficulty: 1,
    subSkill: 'Intercept Dataset to Standard Form',
    prompt:
      'From the dataset below, determine the equation of the quadratic function in the form $y = ax^2 + bx + c$.',
    dataset: { rows },
    choices,
    correctIndex,
    explanation: {
      formulaUsed: '$y = a(x - r_1)(x - r_2) \\rightarrow y = ax^2 + bx + c$',
      methodReason:
        'Look for inputs where $y = 0$ in the table to read the roots $r_1$ and $r_2$, then test another point to find $a$ and expand.',
      substitution: `The table shows $y = 0$ at $x = ${r1}$ and $x = ${r2}$, so $r_1 = ${r1}$ and $r_2 = ${r2}$. Substitute $(${pt.x}, ${pt.y})$:`,
      calculations: `$${pt.y} = a(${pt.x} ${r1 >= 0 ? `- ${r1}` : `+ ${Math.abs(r1)}`})(${pt.x} ${r2 >= 0 ? `- ${r2}` : `+ ${Math.abs(r2)}`}) = ${(pt.x - r1) * (pt.x - r2)}a \\implies a = ${a}$. Expanding $${formatFactoredForm(a, 1, r1, r2, 'y')}$ gives $y = ${formatStandardPoly(a, b, c)}$.`,
      finalAnswer: correct,
    },
  };
}

function genQuadLevel2(): MathQuestion {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Symmetric table with non-unit integer a -> y = ax^2 + bx + c
    const a = randChoice([-3, -2, 2, 3]);
    const h = randInt(-4, 4);
    const k = randInt(-5, 5);
    const b = -2 * a * h;
    const c = a * h * h + k;
    const xs = [h - 2, h - 1, h, h + 1, h + 2];
    const rows = xs.map((x) => ({ x, y: a * (x - h) * (x - h) + k }));

    const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
    const candidates = [
      `$y = ${formatStandardPoly(1, -2 * h, h * h + k)}$`,
      `$y = ${formatStandardPoly(-a, -b, a * h * h + k)}$`,
      `$y = ${formatStandardPoly(a, 2 * a * h, c)}$`,
      `$y = ${formatStandardPoly(a + (a > 0 ? 1 : -1), b, c)}$`,
      `$y = ${formatStandardPoly(a, b, k)}$`,
      `$y = ${formatStandardPoly(a, b + 2, c - 1)}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `qf-L2-ds-vertex-${a}-${h}-${k}`,
      topic: 'quadratic_function',
      difficulty: 2,
      subSkill: 'Symmetric Dataset to Standard Form',
      prompt:
        'Determine the quadratic equation in the form $y = ax^2 + bx + c$ that matches the dataset.',
      dataset: { rows },
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = a(x - h)^2 + k \\rightarrow y = ax^2 + bx + c$',
        methodReason:
          `Equal $y$ outputs on both sides of $x = ${h}$ show that $(${h}, ${k})$ is the vertex. Use an adjacent point to solve for $a$, then expand.`,
        substitution: `Substitute $(h, k) = (${h}, ${k})$ and $(${h + 1}, ${a + k})$: $${a + k} = a(${h + 1} ${h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}$.`,
        calculations: `$${a + k} = a(1)^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`} \\implies a = ${a}$. Expanding $${formatVertexForm(a, 1, h, k, 'y')}$ gives $y = ${formatStandardPoly(a, b, c)}$.`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Roots visible in table with non-unit integer a -> y = ax^2 + bx + c
    const a = randChoice([-3, -2, 2, 3]);
    const r1 = randInt(-3, 1);
    const r2 = r1 + randInt(2, 4);
    const b = -a * (r1 + r2);
    const c = a * r1 * r2;
    const xs = Array.from(new Set([r1 - 1, r1, r1 + 1, r2, r2 + 1])).sort((u, v) => u - v);
    const rows = xs.map((x) => ({ x, y: a * (x - r1) * (x - r2) }));
    const pt = rows.find((p) => p.x !== r1 && p.x !== r2)!;

    const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
    const candidates = [
      `$y = ${formatStandardPoly(1, -(r1 + r2), r1 * r2)}$`,
      `$y = ${formatStandardPoly(-a, -b, -c)}$`,
      `$y = ${formatStandardPoly(a, a * (r1 + r2), c)}$`,
      `$y = ${formatStandardPoly(a + (a > 0 ? 1 : -1), b, c)}$`,
      `$y = ${formatStandardPoly(a, b + 2, c - 1)}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `qf-L2-ds-roots-${a}-${r1}-${r2}`,
      topic: 'quadratic_function',
      difficulty: 2,
      subSkill: 'Intercept Dataset to Standard Form',
      prompt:
        'Find the equation of the quadratic function in the form $y = ax^2 + bx + c$ for the given dataset.',
      dataset: { rows },
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = a(x - r_1)(x - r_2) \\rightarrow y = ax^2 + bx + c$',
        methodReason:
          'Identify the two $x$-intercepts where $y = 0$ in the table, plug in any non-zero point to solve for $a$, then expand.',
        substitution: `Roots are $r_1 = ${r1}$ and $r_2 = ${r2}$. Using $(${pt.x}, ${pt.y})$: $${pt.y} = a(${pt.x} ${r1 >= 0 ? `- ${r1}` : `+ ${Math.abs(r1)}`})(${pt.x} ${r2 >= 0 ? `- ${r2}` : `+ ${Math.abs(r2)}`})$.`,
        calculations: `$${pt.y} = ${(pt.x - r1) * (pt.x - r2)}a \\implies a = ${a}$. Expanding $${formatFactoredForm(a, 1, r1, r2, 'y')}$ gives $y = ${formatStandardPoly(a, b, c)}$.`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 2: Consecutive table centered at x = 0 for y = ax^2 + bx + c
  const a = randChoice([-2, -1, 1, 2]);
  const b = randNonZero(-4, 4);
  const c = randInt(-5, 5);
  const xs = [-2, -1, 0, 1, 2];
  const rows = xs.map((x) => ({ x, y: a * x * x + b * x + c }));
  const yNeg1 = a - b + c;
  const yPos1 = a + b + c;

  const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
  const candidates = [
    `$y = ${formatStandardPoly(a, -b, c)}$`,
    `$y = ${formatStandardPoly(-a, b, c)}$`,
    `$y = ${formatStandardPoly(a, b, c === 0 ? 2 : -c)}$`,
    `$y = ${formatStandardPoly(a + (a > 0 ? 1 : -1), b, c)}$`,
    `$y = ${formatStandardPoly(a, b + 1, c)}$`,
  ];
  const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

  return {
    id: nextId(),
    signature: `qf-L2-ds-std0-${a}-${b}-${c}`,
    topic: 'quadratic_function',
    difficulty: 2,
    subSkill: 'Centered Dataset to Standard Form',
    prompt:
      'Determine the quadratic function in the form $y = ax^2 + bx + c$ represented by the dataset.',
    dataset: { rows },
    choices,
    correctIndex,
    explanation: {
      formulaUsed: '$y = ax^2 + bx + c$',
      methodReason:
        'Since $x = 0$ is in the table, $c$ equals the $y$-value at $x = 0$. Then substitute $x = 1$ and $x = -1$ to solve for $a$ and $b$.',
      substitution: `At $x = 0$: $c = ${c}$. At $x = 1$: $a + b + ${c} = ${yPos1} \\implies a + b = ${yPos1 - c}$. At $x = -1$: $a - b + ${c} = ${yNeg1} \\implies a - b = ${yNeg1 - c}$.`,
      calculations: `Adding gives $2a = ${2 * a} \\implies a = ${a}$, and $b = ${yPos1 - c} - (${a}) = ${b}$. So $y = ${formatStandardPoly(a, b, c)}$.`,
      finalAnswer: correct,
    },
  };
}

function genQuadLevel3(): MathQuestion {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Symmetric vertex dataset -> expand to y = ax^2 + bx + c (+ optional graph)
    const a = randNonZero(-3, 3);
    const h = randNonZero(-4, 4);
    const k = randInt(-5, 5);
    const b = -2 * a * h;
    const c = a * h * h + k;
    const xs = [h - 2, h - 1, h, h + 1, h + 2];
    const rows = xs.map((x) => ({ x, y: a * x * x + b * x + c }));
    const showGraph = randChoice([true, false]);

    const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
    const candidates = [
      `$y = ${formatStandardPoly(1, -2 * h, h * h + k)}$`,
      `$y = ${formatStandardPoly(a, 2 * a * h, c)}$`,
      `$y = ${formatStandardPoly(-a, -b, a * h * h + k)}$`,
      `$y = ${formatStandardPoly(a, b, k)}$`,
      `$y = ${formatStandardPoly(a + (a > 0 ? 1 : -1), b, c)}$`,
      `$y = ${formatStandardPoly(a, b + 2, c - 1)}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `qf-L3-ds-vstd-${a}-${h}-${k}`,
      topic: 'quadratic_function',
      difficulty: 3,
      subSkill: 'Symmetric Dataset to Standard Form',
      prompt:
        'Find the equation of the quadratic function in the form $y = ax^2 + bx + c$ from the dataset below.',
      dataset: { rows },
      graph: showGraph
        ? {
            a,
            b,
            c,
            points: [
              { x: h, y: k, label: `V(${h}, ${k})`, emphasis: 'vertex' },
              { x: h + 1, y: a + k, label: `(${h + 1}, ${a + k})`, emphasis: 'point' },
            ],
            caption: 'Graph corresponding to the dataset.',
          }
        : undefined,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = a(x - h)^2 + k \\rightarrow y = ax^2 + bx + c$',
        methodReason:
          'Spot the symmetric center $(h, k)$ in the dataset to write vertex form, solve for $a$ using another row, and expand to $y = ax^2 + bx + c$.',
        substitution: `The symmetry center is $(${h}, ${k})$. Using $(${h + 1}, ${a + k})$: $${a + k} = a(${h + 1} ${h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}$.`,
        calculations: `$a = ${a}$, giving $${formatVertexForm(a, 1, h, k, 'y')}$. Expanding: $${a}(x^2 ${-2 * h >= 0 ? `+ ${-2 * h}x` : `- ${Math.abs(2 * h)}x`} + ${h * h}) ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`} = ${formatStandardPoly(a, b, c)}$.`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Roots in dataset -> y = ax^2 + bx + c (+ optional graph)
    const a = randNonZero(-2, 3);
    const r1 = randInt(-4, 1);
    const r2 = r1 + randInt(2, 5);
    const b = -a * (r1 + r2);
    const c = a * r1 * r2;
    const xs = Array.from(new Set([r1 - 1, r1, r1 + 1, r2, r2 + 1])).sort((u, v) => u - v);
    const rows = xs.map((x) => ({ x, y: a * x * x + b * x + c }));
    const pt = rows.find((p) => p.x !== r1 && p.x !== r2)!;
    const showGraph = randChoice([true, false]);

    const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
    const candidates = [
      `$y = ${formatStandardPoly(1, -(r1 + r2), r1 * r2)}$`,
      `$y = ${formatStandardPoly(a, a * (r1 + r2), c)}$`,
      `$y = ${formatStandardPoly(-a, -b, -c)}$`,
      `$y = ${formatStandardPoly(a + (a > 0 ? 1 : -1), b, c)}$`,
      `$y = ${formatStandardPoly(a, b + 2, c + 1)}$`,
      `$y = ${formatStandardPoly(a, b - 2, c - 1)}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `qf-L3-ds-rstd-${a}-${r1}-${r2}`,
      topic: 'quadratic_function',
      difficulty: 3,
      subSkill: 'Roots Dataset to Standard Form',
      prompt:
        'Using the dataset below, determine the quadratic function in the form $y = ax^2 + bx + c$.',
      dataset: { rows },
      graph: showGraph
        ? {
            a,
            b,
            c,
            points: [
              { x: r1, y: 0, label: `(${r1}, 0)`, emphasis: 'root' },
              { x: r2, y: 0, label: `(${r2}, 0)`, emphasis: 'root' },
              { x: pt.x, y: pt.y, label: `(${pt.x}, ${pt.y})`, emphasis: 'point' },
            ],
            caption: 'Graph corresponding to the dataset.',
          }
        : undefined,
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = a(x - r_1)(x - r_2) \\rightarrow y = ax^2 + bx + c$',
        methodReason:
          'Read the roots where $y = 0$ from the table, plug in another point to solve for $a$, and expand.',
        substitution: `Roots: $r_1 = ${r1}, r_2 = ${r2}$. Using $(${pt.x}, ${pt.y})$: $${pt.y} = a(${pt.x} ${r1 >= 0 ? `- ${r1}` : `+ ${Math.abs(r1)}`})(${pt.x} ${r2 >= 0 ? `- ${r2}` : `+ ${Math.abs(r2)}`})$.`,
        calculations: `$${pt.y} = ${(pt.x - r1) * (pt.x - r2)}a \\implies a = ${a}$. Expanding $${formatFactoredForm(a, 1, r1, r2, 'y')}$ gives $y = ${formatStandardPoly(a, b, c)}$.`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 2: Consecutive x = [0, 1, 2, 3, 4] (not necessarily centered) -> y = ax^2 + bx + c
  const a = randChoice([-2, -1, 1, 2, 3]);
  const b = randNonZero(-5, 5);
  const c = randInt(-5, 5);
  const xs = [0, 1, 2, 3, 4];
  const rows = xs.map((x) => ({ x, y: a * x * x + b * x + c }));
  const y1 = a + b + c;
  const y2 = 4 * a + 2 * b + c;

  const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
  const candidates = [
    `$y = ${formatStandardPoly(2 * a, b, c)}$`, // forgot delta^2 y = 2a
    `$y = ${formatStandardPoly(a, -b, c)}$`,
    `$y = ${formatStandardPoly(-a, b, c)}$`,
    `$y = ${formatStandardPoly(a, b, c === 0 ? 3 : -c)}$`,
    `$y = ${formatStandardPoly(a, b + 2, c)}$`,
    `$y = ${formatStandardPoly(a, b - 2, c)}$`,
  ];
  const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

  return {
    id: nextId(),
    signature: `qf-L3-ds-consec-${a}-${b}-${c}`,
    topic: 'quadratic_function',
    difficulty: 3,
    subSkill: 'Consecutive Dataset to Standard Form',
    prompt:
      'Find the quadratic equation $y = ax^2 + bx + c$ that produces the dataset below.',
    dataset: { rows },
    choices,
    correctIndex,
    explanation: {
      formulaUsed: '$y = ax^2 + bx + c$ (or second differences $\\Delta^2 y = 2a$)',
      methodReason:
        'Read $c$ at $x = 0$ directly from the table, then use $x = 1$ and $x = 2$ (or constant second differences) to find $a$ and $b$.',
      substitution: `At $x = 0$: $c = ${c}$. First differences: $${y1 - c}, ${y2 - y1}, ${rows[3].y - y2}, ${rows[4].y - rows[3].y}$. Second difference: $\\Delta^2 y = ${2 * a}$.`,
      calculations: `Since $2a = ${2 * a}$, $a = ${a}$. Using $(1, ${y1})$: $${a} + b + ${c} = ${y1} \\implies b = ${b}$. Thus $y = ${formatStandardPoly(a, b, c)}$.`,
      finalAnswer: correct,
    },
  };
}

function genQuadLevel4(): MathQuestion {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Minimal 3-point dataset including (0, c) with non-consecutive x -> y = ax^2 + bx + c
    const a = randNonZero(-3, 3);
    const b = randNonZero(-5, 5);
    const c = randNonZero(-6, 6);
    const x1 = randChoice([-1, 1]);
    const x2 = randChoice([-3, -2, 2, 3]);
    const xs = [0, x1, x2].sort((u, v) => u - v);
    const rows = xs.map((x) => ({ x, y: a * x * x + b * x + c }));
    const y1 = a * x1 * x1 + b * x1 + c;
    const y2 = a * x2 * x2 + b * x2 + c;

    const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
    const candidates = [
      `$y = ${formatStandardPoly(a, -b, c)}$`,
      `$y = ${formatStandardPoly(-a, b, c)}$`,
      `$y = ${formatStandardPoly(a, b, -c)}$`,
      `$y = ${formatStandardPoly(a + (a > 0 ? 1 : -1), b - 1, c)}$`,
      `$y = ${formatStandardPoly(a, b + 2, c)}$`,
      `$y = ${formatStandardPoly(a, b - 2, c)}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `qf-L4-ds-3pt0-${a}-${b}-${c}-${x1}-${x2}`,
      topic: 'quadratic_function',
      difficulty: 4,
      subSkill: 'Three-Point Dataset System',
      prompt:
        'Find the quadratic equation $y = ax^2 + bx + c$ that fits the 3-point dataset below.',
      dataset: { rows },
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = ax^2 + bx + c$',
        methodReason:
          `Use $(0, ${c})$ first to determine $c$, then substitute the remaining two points to solve a $2 \\times 2$ system for $a$ and $b$.`,
        substitution: `From $(0, ${c})$: $c = ${c}$. From $(${x1}, ${y1})$: $a ${x1 > 0 ? '+ b' : '- b'} = ${y1 - c}$. From $(${x2}, ${y2})$: $${x2 * x2}a ${x2 > 0 ? `+ ${x2}b` : `- ${Math.abs(x2)}b`} = ${y2 - c}$.`,
        calculations: `Solving the system gives $a = ${a}$ and $b = ${b}$, so $y = ${formatStandardPoly(a, b, c)}$.`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Dataset with fractional a (+-1/2 or +-1/3) and clean integer table entries -> y = ax^2 + bx + c
    const aDen = randChoice([2, 3]);
    const aNum = randChoice([-1, 1]);
    const h = randInt(-3, 3);
    const k = randInt(-4, 4);
    const bNum = -2 * aNum * h;
    const cNum = aNum * h * h + k * aDen;
    const xs = [h - 2 * aDen, h - aDen, h, h + aDen, h + 2 * aDen];
    const rows = xs.map((x) => ({
      x,
      y: (aNum * (x - h) * (x - h)) / aDen + k,
    }));
    const adjX = h + aDen;
    const adjY = aNum * aDen + k;

    const correct = `$${formatStandardFunctionRational(aNum, bNum, cNum, aDen, 'y')}$`;
    const candidates = [
      `$${formatStandardFunctionRational(-aNum, bNum, cNum, aDen, 'y')}$`,
      `$${formatStandardFunctionRational(aNum, -bNum, cNum, aDen, 'y')}$`,
      `$${formatStandardFunctionRational(aNum * aDen, bNum, cNum, aDen, 'y')}$`,
      `$${formatStandardFunctionRational(aNum, bNum, cNum + aDen * 2, aDen, 'y')}$`,
      `$${formatStandardFunctionRational(aNum, bNum + aDen, cNum, aDen, 'y')}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `qf-L4-ds-fracv-${aNum}-${aDen}-${h}-${k}`,
      topic: 'quadratic_function',
      difficulty: 4,
      subSkill: 'Fractional Coefficient from Dataset',
      prompt:
        'Determine the quadratic equation in the form $y = ax^2 + bx + c$ represented by the dataset.',
      dataset: { rows },
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = a(x - h)^2 + k \\rightarrow y = ax^2 + bx + c$',
        methodReason:
          'Identify the symmetric center $(h, k)$ in the table, substitute another point to find $a$ as a reduced fraction, then expand to $y = ax^2 + bx + c$.',
        substitution: `The vertex is $(${h}, ${k})$. Using $(${adjX}, ${adjY})$: $${adjY} = a(${adjX} ${h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}$.`,
        calculations: `$${adjY - k} = ${aDen * aDen}a \\implies a = \\frac{${adjY - k}}{${aDen * aDen}} = ${formatFractionLatex(aNum, aDen)}$. Expanding $${formatVertexForm(aNum, aDen, h, k, 'y')}$ gives $${formatStandardFunctionRational(aNum, bNum, cNum, aDen, 'y')}$.`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 2: 3-point dataset where two points share same y (revealing h) + off-center 3rd point (vertex NOT in table)
  const a = randChoice([-2, -1, 1, 2]);
  const h = randInt(-2, 3);
  const k = randInt(-4, 4);
  const d = randChoice([1, 2]);
  const x1 = h - d;
  const x3 = h + d;
  const x2 = h + d + 1;
  const ySym = a * d * d + k;
  const y2 = a * (d + 1) * (d + 1) + k;
  const rows = [
    { x: x1, y: ySym },
    { x: x3, y: ySym },
    { x: x2, y: y2 },
  ].sort((u, v) => u.x - v.x);

  const b = -2 * a * h;
  const c = a * h * h + k;

  const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
  const candidates = [
    `$y = ${formatStandardPoly(-a, -b, a * h * h + k)}$`,
    `$y = ${formatStandardPoly(a, -b, c)}$`,
    `$y = ${formatStandardPoly(a + (a > 0 ? 1 : -1), b, c)}$`,
    `$y = ${formatStandardPoly(a, b + 2, c - 1)}$`,
    `$y = ${formatStandardPoly(a, b - 2, c + 1)}$`,
  ];
  const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

  return {
    id: nextId(),
    signature: `qf-L4-ds-sym3-${a}-${h}-${k}-${d}`,
    topic: 'quadratic_function',
    difficulty: 4,
    subSkill: 'Hidden Vertex from Equal Outputs',
    prompt:
      'Use the 3-point dataset below to find the quadratic equation in the form $y = ax^2 + bx + c$.',
    dataset: { rows },
    choices,
    correctIndex,
    explanation: {
      formulaUsed: 'Axis of symmetry $h = \\frac{x_1 + x_3}{2}$, then $y = a(x - h)^2 + k$',
      methodReason:
        'Two points with equal $y$ values are symmetric across $x = h$, giving $h$ even though the vertex is not listed in the table.',
      substitution: `Since $y = ${ySym}$ at both $x = ${x1}$ and $x = ${x3}$, $h = \\frac{${x1} + ${x3}}{2} = ${h}$. Plug $(${x1}, ${ySym})$ and $(${x2}, ${y2})$ into $y = a(x ${h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})^2 + k$:`,
      calculations: `$${d * d}a + k = ${ySym}$ and $${(d + 1) * (d + 1)}a + k = ${y2}$. Subtracting gives $${2 * d + 1}a = ${y2 - ySym} \\implies a = ${a},\\; k = ${k}$. Expanding gives $y = ${formatStandardPoly(a, b, c)}$.`,
      finalAnswer: correct,
    },
  };
}

function genQuadLevel5(): MathQuestion {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // Minimal 3-point dataset WITHOUT x = 0 (three non-zero x values) -> y = ax^2 + bx + c
    const a = randNonZero(-3, 3);
    const b = randNonZero(-5, 5);
    const c = randNonZero(-5, 5);
    const xSets = [
      [-1, 1, 2],
      [1, 2, 3],
      [-2, -1, 1],
      [-2, 1, 3],
    ];
    const xs = randChoice(xSets);
    const rows = xs.map((x) => ({ x, y: a * x * x + b * x + c }));
    const [p1, p2, p3] = rows;

    const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
    const candidates = [
      `$y = ${formatStandardPoly(a, -b, c)}$`,
      `$y = ${formatStandardPoly(-a, b, c)}$`,
      `$y = ${formatStandardPoly(a, b, -c)}$`,
      `$y = ${formatStandardPoly(a + (a > 0 ? 1 : -1), b, c)}$`,
      `$y = ${formatStandardPoly(a, b + 2, c - 1)}$`,
      `$y = ${formatStandardPoly(a, b - 2, c + 1)}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    const eqStr = (x: number, y: number) =>
      `${x * x === 1 ? '' : x * x}a ${x >= 0 ? `+ ${x === 1 ? '' : x}b` : `- ${Math.abs(x) === 1 ? '' : Math.abs(x)}b`} + c = ${y}`;

    return {
      id: nextId(),
      signature: `qf-L5-ds-no0-${a}-${b}-${c}-${xs.join('_')}`,
      topic: 'quadratic_function',
      difficulty: 5,
      subSkill: 'General Three-Point System (No Intercept)',
      prompt:
        'Determine the quadratic equation $y = ax^2 + bx + c$ that passes through all three points in the dataset.',
      dataset: { rows },
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = ax^2 + bx + c$',
        methodReason:
          'Substitute all three points to form three linear equations in $a, b, c$. Subtract pairs of equations to eliminate $c$ first.',
        substitution: `(1) $${eqStr(p1.x, p1.y)}$; (2) $${eqStr(p2.x, p2.y)}$; (3) $${eqStr(p3.x, p3.y)}$.`,
        calculations: `Eliminating $c$ between (2)-(1) and (3)-(2) gives a $2 \\times 2$ system in $a$ and $b$, yielding $a = ${a}$, $b = ${b}$, and substituting back gives $c = ${c}$. Thus $y = ${formatStandardPoly(a, b, c)}$.`,
        finalAnswer: correct,
      },
    };
  }

  if (variant === 1) {
    // Dataset + Graph with fractional a = +-1/2 -> y = ax^2 + bx + c with rational coefficients
    const aNum = randChoice([-1, 1]);
    const aDen = 2;
    const h = randNonZero(-3, 3);
    const k = randNonZero(-4, 4);
    const bNum = -2 * aNum * h;
    const cNum = aNum * h * h + k * aDen;

    const xs = [h - 2, h, h + 2, h + 4];
    const rows = xs.map((x) => ({
      x,
      y: (aNum * (x - h) * (x - h)) / aDen + k,
    }));

    const correct = `$${formatStandardFunctionRational(aNum, bNum, cNum, aDen, 'y')}$`;
    const candidates = [
      `$${formatStandardFunctionRational(-aNum, bNum, cNum, aDen, 'y')}$`,
      `$${formatStandardFunctionRational(aNum, -bNum, cNum, aDen, 'y')}$`,
      `$${formatStandardFunctionRational(aNum * 2, bNum, cNum, aDen, 'y')}$`,
      `$${formatStandardFunctionRational(aNum, bNum, cNum + 2, aDen, 'y')}$`,
      `$${formatStandardFunctionRational(aNum, bNum + 2, cNum, aDen, 'y')}$`,
    ];
    const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

    return {
      id: nextId(),
      signature: `qf-L5-ds-fracstd-${aNum}-${h}-${k}`,
      topic: 'quadratic_function',
      difficulty: 5,
      subSkill: 'Dataset & Graph to Rational Standard Form',
      prompt:
        'Using the dataset and coordinate graph below, determine the quadratic equation in the form $y = ax^2 + bx + c$.',
      dataset: { rows },
      graph: {
        a: aNum / aDen,
        b: bNum / aDen,
        c: cNum / aDen,
        points: [
          { x: h, y: k, label: `V(${h}, ${k})`, emphasis: 'vertex' },
          { x: h + 2, y: (aNum * 4) / 2 + k, label: `(${h + 2}, ${(aNum * 4) / 2 + k})`, emphasis: 'point' },
        ],
        caption: 'Parabola passing through every point in the dataset.',
      },
      choices,
      correctIndex,
      explanation: {
        formulaUsed: '$y = a(x - h)^2 + k \\rightarrow y = ax^2 + bx + c$',
        methodReason:
          'Use the vertex $(h, k)$ and another point from the dataset/graph to find $a$ as a fraction, then expand to $y = ax^2 + bx + c$.',
        substitution: `Vertex $(${h}, ${k})$ and point $(${h + 2}, ${rows[2].y})$: $${rows[2].y} = a(${h + 2} ${h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}$.`,
        calculations: `$${rows[2].y - k} = 4a \\implies a = ${formatFractionLatex(aNum, aDen)}$. Expanding $${formatVertexForm(aNum, aDen, h, k, 'y')}$ gives $${formatStandardFunctionRational(aNum, bNum, cNum, aDen, 'y')}$.`,
        finalAnswer: correct,
      },
    };
  }

  // Variant 2: Non-consecutive 4-point shifted dataset (avoiding x = 0) -> y = ax^2 + bx + c
  const a = randChoice([-2, -1, 1, 2]);
  const b = randNonZero(-4, 4);
  const c = randNonZero(-5, 5);
  const xs = randChoice([
    [-2, -1, 2, 4],
    [1, 2, 4, 5],
    [-3, -1, 1, 3],
  ]);
  const rows = xs.map((x) => ({ x, y: a * x * x + b * x + c }));
  const [p1, p2, p3] = rows;

  const correct = `$y = ${formatStandardPoly(a, b, c)}$`;
  const candidates = [
    `$y = ${formatStandardPoly(-a, b, c)}$`,
    `$y = ${formatStandardPoly(a, -b, c)}$`,
    `$y = ${formatStandardPoly(a, b, -c)}$`,
    `$y = ${formatStandardPoly(a + (a > 0 ? 1 : -1), b, c)}$`,
    `$y = ${formatStandardPoly(a, b + 2, c - 1)}$`,
    `$y = ${formatStandardPoly(a, b - 2, c + 1)}$`,
  ];
  const { choices, correctIndex } = buildShuffledChoices(correct, candidates);

  return {
    id: nextId(),
    signature: `qf-L5-ds-nonconsec-${a}-${b}-${c}-${xs.join('_')}`,
    topic: 'quadratic_function',
    difficulty: 5,
    subSkill: 'Non-Consecutive Dataset Synthesis',
    prompt:
      'Find the quadratic equation in the form $y = ax^2 + bx + c$ that satisfies the entire dataset.',
    dataset: { rows },
    choices,
    correctIndex,
    explanation: {
      formulaUsed: '$y = ax^2 + bx + c$',
      methodReason:
        'Pick any three points from the non-consecutive dataset, substitute them into $y = ax^2 + bx + c$, eliminate $c$, and solve for $a, b, c$.',
      substitution: `Using $(${p1.x}, ${p1.y})$, $(${p2.x}, ${p2.y})$, and $(${p3.x}, ${p3.y})$: $${p1.x * p1.x}a + (${p1.x})b + c = ${p1.y}$, $${p2.x * p2.x}a + (${p2.x})b + c = ${p2.y}$, $${p3.x * p3.x}a + (${p3.x})b + c = ${p3.y}$.`,
      calculations: `Subtracting equations to eliminate $c$ yields $a = ${a}$ and $b = ${b}$; substituting back gives $c = ${c}$. Confirming with the 4th point $(${rows[3].x}, ${rows[3].y})$ verifies $y = ${formatStandardPoly(a, b, c)}$.`,
      finalAnswer: correct,
    },
  };
}

// ============================================================================
// PUBLIC GENERATOR API
// ============================================================================

export function generateQuestion(topic: TopicId, difficulty: DifficultyLevel): MathQuestion {
  if (topic === 'nature_of_roots') {
    switch (difficulty) {
      case 1:
        return genNatureLevel1();
      case 2:
        return genNatureLevel2();
      case 3:
        return genNatureLevel3();
      case 4:
        return genNatureLevel4();
      case 5:
        return genNatureLevel5();
    }
  } else {
    switch (difficulty) {
      case 1:
        return genQuadLevel1();
      case 2:
        return genQuadLevel2();
      case 3:
        return genQuadLevel3();
      case 4:
        return genQuadLevel4();
      case 5:
        return genQuadLevel5();
    }
  }
}

export function generateUniqueQuestion(
  topics: TopicId[],
  difficulties: DifficultyLevel[],
  recentSignatures: string[]
): MathQuestion {
  const safeTopics: TopicId[] =
    topics.length > 0 ? topics : ['nature_of_roots', 'quadratic_function'];
  const safeDiffs: DifficultyLevel[] =
    difficulties.length > 0 ? difficulties : [1, 2, 3, 4, 5];

  for (let attempt = 0; attempt < 40; attempt++) {
    const t = randChoice(safeTopics);
    const d = randChoice(safeDiffs);
    const q = generateQuestion(t, d);
    if (!recentSignatures.includes(q.signature)) {
      return q;
    }
  }
  return generateQuestion(randChoice(safeTopics), randChoice(safeDiffs));
}

export function generateMockTestQuestions(
  count: number,
  topics: TopicId[]
): MathQuestion[] {
  const safeTopics: TopicId[] =
    topics.length > 0 ? topics : ['nature_of_roots', 'quadratic_function'];
  const allDiffs: DifficultyLevel[] = [1, 2, 3, 4, 5];

  const questions: MathQuestion[] = [];
  const usedSignatures = new Set<string>();

  let safety = 0;
  while (questions.length < count && safety < count * 50) {
    safety += 1;
    // Independently randomize topic and difficulty for every single question
    const topic = randChoice(safeTopics);
    const difficulty = randChoice(allDiffs);
    const q = generateQuestion(topic, difficulty);
    if (!usedSignatures.has(q.signature)) {
      usedSignatures.add(q.signature);
      questions.push(q);
    }
  }

  // Shuffle final array (Fisher-Yates) so no ordering bias exists
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions;
}
