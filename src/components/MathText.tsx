import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  content: string;
  className?: string;
  block?: boolean;
}

interface TextSegment {
  type: 'text' | 'inline' | 'display';
  value: string;
}

function parseMathSegments(input: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let i = 0;

  while (i < input.length) {
    // Check display math $$...$$
    if (input[i] === '$' && input[i + 1] === '$') {
      const end = input.indexOf('$$', i + 2);
      if (end !== -1) {
        segments.push({ type: 'display', value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }

    // Check inline math $...$
    if (input[i] === '$') {
      const end = input.indexOf('$', i + 1);
      if (end !== -1) {
        segments.push({ type: 'inline', value: input.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    // Plain text until next $
    const nextDollar = input.indexOf('$', i);
    if (nextDollar === -1) {
      segments.push({ type: 'text', value: input.slice(i) });
      break;
    } else {
      segments.push({ type: 'text', value: input.slice(i, nextDollar) });
      i = nextDollar;
    }
  }

  return segments;
}

function renderKatex(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
      output: 'htmlAndMathml',
    });
  } catch {
    return latex;
  }
}

export const MathText: React.FC<MathTextProps> = ({ content, className = '', block = false }) => {
  const segments = useMemo(() => parseMathSegments(content), [content]);

  const Wrapper = block ? 'div' : 'span';

  return (
    <Wrapper className={`break-words ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <React.Fragment key={idx}>{seg.value}</React.Fragment>;
        }
        const html = renderKatex(seg.value, seg.type === 'display');
        if (seg.type === 'display') {
          return (
            <span
              key={idx}
              className="block my-1.5 overflow-x-auto max-w-full"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        return (
          <span
            key={idx}
            className="inline-block max-w-full align-middle"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </Wrapper>
  );
};
