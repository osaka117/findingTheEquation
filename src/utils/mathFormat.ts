export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randNonZero(min: number, max: number): number {
  let v = 0;
  while (v === 0) {
    v = randInt(min, max);
  }
  return v;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const r = Math.round(Math.sqrt(n));
  return r * r === n;
}

/**
 * Formats a rational number num/den in simplified LaTeX without outer $.
 */
export function formatFractionLatex(num: number, den: number = 1): string {
  if (den === 0) throw new Error('Division by zero in fraction formatting');
  if (num === 0) return '0';
  const sign = (num < 0) !== (den < 0) ? -1 : 1;
  const aNum = Math.abs(num);
  const aDen = Math.abs(den);
  const g = gcd(aNum, aDen);
  const sNum = aNum / g;
  const sDen = aDen / g;
  const prefix = sign < 0 ? '-' : '';
  if (sDen === 1) return `${prefix}${sNum}`;
  return `${prefix}\\frac{${sNum}}{${sDen}}`;
}

/**
 * Formats a coefficient for a term like ax^2, bx, or c.
 * Returns null if coeff === 0 (unless includeZero is true).
 */
function formatTerm(coeff: number, variablePart: string, isLeading: boolean): string {
  if (coeff === 0) return '';
  const absVal = Math.abs(coeff);
  const signStr = coeff < 0 ? (isLeading ? '-' : ' - ') : isLeading ? '' : ' + ';
  if (variablePart === '') {
    return `${signStr}${absVal}`;
  }
  const numStr = absVal === 1 ? '' : `${absVal}`;
  return `${signStr}${numStr}${variablePart}`;
}

/**
 * Formats ax^2 + bx + c as clean LaTeX (without outer $).
 */
export function formatStandardPoly(a: number, b: number, c: number, variable = 'x'): string {
  const parts: string[] = [];
  if (a !== 0) {
    parts.push(formatTerm(a, `${variable}^2`, parts.length === 0));
  }
  if (b !== 0) {
    parts.push(formatTerm(b, variable, parts.length === 0));
  }
  if (c !== 0 || parts.length === 0) {
    parts.push(formatTerm(c, '', parts.length === 0));
  }
  return parts.join('');
}

/**
 * Formats a quadratic equation ax^2 + bx + c = 0 as clean LaTeX (without outer $).
 */
export function formatStandardEquation(a: number, b: number, c: number, variable = 'x'): string {
  return `${formatStandardPoly(a, b, c, variable)} = 0`;
}

/**
 * Formats fractional coefficient a in front of a parenthesis or x^2.
 */
export function formatLeadingCoeffFrac(num: number, den: number = 1): string {
  const g = gcd(Math.abs(num), Math.abs(den));
  const sign = (num < 0) !== (den < 0) ? -1 : 1;
  const sNum = Math.abs(num) / g;
  const sDen = Math.abs(den) / g;
  if (sDen === 1) {
    if (sNum === 1) return sign < 0 ? '-' : '';
    return `${sign < 0 ? '-' : ''}${sNum}`;
  }
  return `${sign < 0 ? '-' : ''}\\frac{${sNum}}{${sDen}}`;
}

/**
 * Formats vertex form y = a(x - h)^2 + k (without outer $).
 */
export function formatVertexForm(
  aNum: number,
  aDen: number,
  h: number,
  k: number,
  lhs = 'y'
): string {
  const aPart = formatLeadingCoeffFrac(aNum, aDen);
  let xPart: string;
  if (h === 0) {
    xPart = 'x^2';
  } else if (h > 0) {
    xPart = `(x - ${h})^2`;
  } else {
    xPart = `(x + ${Math.abs(h)})^2`;
  }

  let kPart = '';
  if (k > 0) kPart = ` + ${k}`;
  else if (k < 0) kPart = ` - ${Math.abs(k)}`;

  return `${lhs} = ${aPart}${xPart}${kPart}`;
}

/**
 * Formats factored form y = a(x - r1)(x - r2) (without outer $).
 */
export function formatFactoredForm(
  aNum: number,
  aDen: number,
  r1: number,
  r2: number,
  lhs = 'y'
): string {
  const aPart = formatLeadingCoeffFrac(aNum, aDen);

  const fmtFactor = (r: number) => {
    if (r === 0) return 'x';
    if (r > 0) return `(x - ${r})`;
    return `(x + ${Math.abs(r)})`;
  };

  if (r1 === r2) {
    if (r1 === 0) return `${lhs} = ${aPart}x^2`;
    return `${lhs} = ${aPart}${fmtFactor(r1)}^2`;
  }

  // Keep x factor first if one root is 0 for cleaner notation
  if (r2 === 0 && r1 !== 0) {
    return `${lhs} = ${aPart}x${fmtFactor(r1)}`;
  }

  return `${lhs} = ${aPart}${fmtFactor(r1)}${fmtFactor(r2)}`;
}

/**
 * Formats standard quadratic function with potentially fractional coefficients
 * derived from integer numerator and common denominator (e.g. a = aNum/den).
 */
export function formatStandardFunctionRational(
  aNum: number,
  bNum: number,
  cNum: number,
  den: number = 1,
  lhs = 'y'
): string {
  const terms: string[] = [];

  const pushFracTerm = (num: number, varPart: string) => {
    if (num === 0) return;
    const isFirst = terms.length === 0;
    const g = gcd(Math.abs(num), Math.abs(den));
    const sign = (num < 0) !== (den < 0) ? -1 : 1;
    const sNum = Math.abs(num) / g;
    const sDen = Math.abs(den) / g;

    const signStr = sign < 0 ? (isFirst ? '-' : ' - ') : isFirst ? '' : ' + ';
    if (sDen === 1) {
      if (varPart === '') {
        terms.push(`${signStr}${sNum}`);
      } else {
        terms.push(`${signStr}${sNum === 1 ? '' : sNum}${varPart}`);
      }
    } else {
      terms.push(`${signStr}\\frac{${sNum}}{${sDen}}${varPart}`);
    }
  };

  pushFracTerm(aNum, 'x^2');
  pushFracTerm(bNum, 'x');
  pushFracTerm(cNum, '');
  if (terms.length === 0) terms.push('0');

  return `${lhs} = ${terms.join('')}`;
}

/**
 * Wraps signed integer in parentheses if negative when substituting into formula.
 */
export function parenSigned(n: number): string {
  return n < 0 ? `(${n})` : `${n}`;
}

/**
 * Shuffles an array of 4 choices and returns shuffled tuple + new correctIndex.
 * Guarantees 4 unique choices; throws if duplicates slipped through during dev.
 */
export function buildShuffledChoices(
  correct: string,
  distractors: string[]
): { choices: [string, string, string, string]; correctIndex: number } {
  const unique: string[] = [correct];
  for (const d of distractors) {
    if (!unique.includes(d)) {
      unique.push(d);
    }
    if (unique.length === 4) break;
  }

  if (unique.length < 4) {
    throw new Error(`Not enough unique choices for "${correct}": got ${JSON.stringify(unique)}`);
  }

  const tagged = unique.map((text, idx) => ({ text, isCorrect: idx === 0 }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }

  const correctIndex = tagged.findIndex((t) => t.isCorrect);
  return {
    choices: [tagged[0].text, tagged[1].text, tagged[2].text, tagged[3].text],
    correctIndex,
  };
}
