import React from 'react';
import { QuadraticDataset } from '../types/math';

interface DatasetTableProps {
  dataset: QuadraticDataset;
}

export const DatasetTable: React.FC<DatasetTableProps> = ({ dataset }) => {
  const xLabel = dataset.xLabel ?? 'x';
  const yLabel = dataset.yLabel ?? 'y';

  return (
    <div className="retro-inset p-3.5 w-full overflow-x-auto">
      <div className="font-retro text-[11px] uppercase tracking-wider text-[#fbbf24] mb-2">
        Function Dataset
      </div>
      <table
        className="w-full border-collapse font-retro text-xs sm:text-sm text-center"
        aria-label="Dataset of x and y values"
      >
        <tbody>
          <tr className="bg-[#121c2a] border border-[#2e435e]">
            <th
              scope="row"
              className="px-3 py-2 text-left text-[#38bdf8] font-semibold border-r-2 border-[#2e435e] w-20 bg-[#152233]"
            >
              {xLabel}
            </th>
            {dataset.rows.map((pt, idx) => (
              <td
                key={`x-${idx}`}
                className="px-3 py-2 text-[#eef2f6] border-r border-[#223348] last:border-r-0 min-w-[44px]"
              >
                {pt.x}
              </td>
            ))}
          </tr>
          <tr className="bg-[#091019] border border-t-0 border-[#2e435e]">
            <th
              scope="row"
              className="px-3 py-2 text-left text-[#4ade80] font-semibold border-r-2 border-[#2e435e] w-20 bg-[#111c2b]"
            >
              {yLabel}
            </th>
            {dataset.rows.map((pt, idx) => (
              <td
                key={`y-${idx}`}
                className="px-3 py-2 text-[#e2e8f0] border-r border-[#223348] last:border-r-0 min-w-[44px]"
              >
                {pt.y}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {dataset.caption && (
        <p className="mt-2 text-xs font-retro text-[#a5b4c7]">{dataset.caption}</p>
      )}
    </div>
  );
};
