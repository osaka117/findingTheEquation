import React, { useMemo } from 'react';
import { QuadraticGraphData } from '../types/math';

interface QuadraticGraphProps {
  graph: QuadraticGraphData;
  compact?: boolean;
}

export const QuadraticGraph: React.FC<QuadraticGraphProps> = ({ graph, compact = false }) => {
  const { a, b, c, points, caption } = graph;

  const bounds = useMemo(() => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;

    xs.push(vx, 0);
    ys.push(vy, 0);

    const minXRaw = Math.min(...xs);
    const maxXRaw = Math.max(...xs);
    const minYRaw = Math.min(...ys);
    const maxYRaw = Math.max(...ys);

    const xPad = Math.max(2, Math.ceil((maxXRaw - minXRaw) * 0.3));
    const yPad = Math.max(2, Math.ceil((maxYRaw - minYRaw) * 0.25));

    let minX = Math.floor(minXRaw) - xPad;
    let maxX = Math.ceil(maxXRaw) + xPad;
    let minY = Math.floor(minYRaw) - yPad;
    let maxY = Math.ceil(maxYRaw) + yPad;

    // Ensure reasonable minimum span so parabola shape is clear
    if (maxX - minX < 10) {
      const mid = Math.round((minX + maxX) / 2);
      minX = mid - 5;
      maxX = mid + 5;
    }
    if (maxY - minY < 10) {
      const mid = Math.round((minY + maxY) / 2);
      minY = mid - 5;
      maxY = mid + 5;
    }

    return { minX, maxX, minY, maxY };
  }, [a, b, c, points]);

  const width = 420;
  const height = compact ? 250 : 300;
  const pad = { top: 20, right: 24, bottom: 26, left: 34 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const toPxX = (x: number) =>
    pad.left + ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * plotW;
  const toPxY = (y: number) =>
    pad.top + ((bounds.maxY - y) / (bounds.maxY - bounds.minY)) * plotH;

  const xStep = useMemo(() => {
    const span = bounds.maxX - bounds.minX;
    if (span <= 14) return 1;
    if (span <= 28) return 2;
    return 5;
  }, [bounds]);

  const yStep = useMemo(() => {
    const span = bounds.maxY - bounds.minY;
    if (span <= 14) return 1;
    if (span <= 28) return 2;
    if (span <= 60) return 5;
    return 10;
  }, [bounds]);

  const xTicks = useMemo(() => {
    const arr: number[] = [];
    const start = Math.ceil(bounds.minX / xStep) * xStep;
    for (let x = start; x <= bounds.maxX; x += xStep) {
      arr.push(x);
    }
    return arr;
  }, [bounds, xStep]);

  const yTicks = useMemo(() => {
    const arr: number[] = [];
    const start = Math.ceil(bounds.minY / yStep) * yStep;
    for (let y = start; y <= bounds.maxY; y += yStep) {
      arr.push(y);
    }
    return arr;
  }, [bounds, yStep]);

  const curvePath = useMemo(() => {
    const samples = 160;
    const cmds: string[] = [];
    let drawing = false;
    const yBuffer = (bounds.maxY - bounds.minY) * 0.25;

    for (let i = 0; i <= samples; i++) {
      const x = bounds.minX + (i / samples) * (bounds.maxX - bounds.minX);
      const y = a * x * x + b * x + c;
      if (y >= bounds.minY - yBuffer && y <= bounds.maxY + yBuffer) {
        const px = toPxX(x).toFixed(1);
        const py = toPxY(y).toFixed(1);
        cmds.push(`${drawing ? 'L' : 'M'} ${px} ${py}`);
        drawing = true;
      } else {
        drawing = false;
      }
    }
    return cmds.join(' ');
  }, [a, b, c, bounds, plotW, plotH]);

  const axisXVisible = bounds.minY <= 0 && bounds.maxY >= 0;
  const axisYVisible = bounds.minX <= 0 && bounds.maxX >= 0;
  const zeroY = toPxY(0);
  const zeroX = toPxX(0);

  return (
    <div className="retro-inset p-3 w-full max-w-[440px]">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto block select-none"
        role="img"
        aria-label={caption || 'Coordinate plane graph of quadratic function'}
      >
        <defs>
          <clipPath id="quadPlotClip">
            <rect x={pad.left} y={pad.top} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        {/* Plot background */}
        <rect
          x={pad.left}
          y={pad.top}
          width={plotW}
          height={plotH}
          fill="#091019"
          stroke="#263a52"
          strokeWidth="1.5"
        />

        {/* Grid lines */}
        {xTicks.map((x) => {
          const px = toPxX(x);
          return (
            <line
              key={`gx-${x}`}
              x1={px}
              y1={pad.top}
              x2={px}
              y2={pad.top + plotH}
              stroke={x === 0 ? '#476589' : '#182638'}
              strokeWidth={x === 0 ? 1.5 : 1}
            />
          );
        })}
        {yTicks.map((y) => {
          const py = toPxY(y);
          return (
            <line
              key={`gy-${y}`}
              x1={pad.left}
              y1={py}
              x2={pad.left + plotW}
              y2={py}
              stroke={y === 0 ? '#476589' : '#182638'}
              strokeWidth={y === 0 ? 1.5 : 1}
            />
          );
        })}

        {/* Axes arrows / labels */}
        {axisXVisible && (
          <text
            x={pad.left + plotW - 10}
            y={Math.min(pad.top + plotH - 6, Math.max(pad.top + 12, zeroY - 6))}
            fill="#94a3b8"
            fontSize="11"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="600"
          >
            x
          </text>
        )}
        {axisYVisible && (
          <text
            x={Math.min(pad.left + plotW - 14, Math.max(pad.left + 6, zeroX + 6))}
            y={pad.top + 12}
            fill="#94a3b8"
            fontSize="11"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="600"
          >
            y
          </text>
        )}

        {/* Axis tick labels */}
        {xTicks
          .filter((x) => x !== 0 && (xTicks.length <= 12 || x % (xStep * 2) === 0))
          .map((x) => (
            <text
              key={`tx-${x}`}
              x={toPxX(x)}
              y={pad.top + plotH + 15}
              fill="#7b8ea6"
              fontSize="10"
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
            >
              {x}
            </text>
          ))}
        {yTicks
          .filter((y) => y !== 0 && (yTicks.length <= 12 || y % (yStep * 2) === 0))
          .map((y) => (
            <text
              key={`ty-${y}`}
              x={pad.left - 6}
              y={toPxY(y) + 3.5}
              fill="#7b8ea6"
              fontSize="10"
              textAnchor="end"
              fontFamily="IBM Plex Mono, monospace"
            >
              {y}
            </text>
          ))}

        {/* Parabola curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.5"
          strokeLinecap="round"
          clipPath="url(#quadPlotClip)"
        />

        {/* Key plotted points */}
        {points.map((pt, idx) => {
          const px = toPxX(pt.x);
          const py = toPxY(pt.y);
          const color =
            pt.emphasis === 'vertex'
              ? '#fbbf24'
              : pt.emphasis === 'root'
                ? '#38bdf8'
                : '#f472b6';

          // Smart label placement so text stays inside plot box
          const placeLeft = px > pad.left + plotW * 0.68;
          const placeBelow = py < pad.top + 28 || (a < 0 && pt.emphasis === 'vertex');
          const labelX = placeLeft ? px - 8 : px + 8;
          const labelY = placeBelow ? py + 15 : py - 8;
          const anchor = placeLeft ? 'end' : 'start';

          return (
            <g key={`${pt.x}-${pt.y}-${idx}`}>
              <circle
                cx={px}
                cy={py}
                r="4.5"
                fill={color}
                stroke="#091019"
                strokeWidth="1.5"
              />
              <rect
                x={anchor === 'end' ? labelX - pt.label.length * 6.2 - 4 : labelX - 2}
                y={labelY - 10}
                width={pt.label.length * 6.2 + 6}
                height={14}
                fill="#091019"
                fillOpacity="0.86"
                rx="1"
              />
              <text
                x={labelX}
                y={labelY}
                fill={color}
                fontSize="10.5"
                fontWeight="600"
                textAnchor={anchor}
                fontFamily="IBM Plex Mono, monospace"
              >
                {pt.label}
              </text>
            </g>
          );
        })}
      </svg>
      {caption && (
        <p className="mt-2 text-xs font-retro text-[#a5b4c7] leading-snug">{caption}</p>
      )}
    </div>
  );
};
