import React from 'react';

interface DataTableProps {
  gridId: number;
  cells: string[];
  onCellChange: (gridId: number, cellIndex: number, value: string) => void;
}

const ROWS = 5;
const COLS = 6;

const DataTable: React.FC<DataTableProps> = ({ gridId, cells, onCellChange }) => {
  const columnSums = React.useMemo(() => {
    const sums = Array(COLS).fill(0);
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const cellIndex = row * COLS + col;
        sums[col] += parseFloat(cells[cellIndex]) || 0;
      }
    }
    return sums;
  }, [cells]);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[650px] md:min-w-[750px] border-2 border-slate-700 rounded-xl overflow-hidden shadow-md bg-white">
        <div className="grid grid-cols-6 divide-x-2 divide-slate-400">
          {/* Editable Cells */}
          {Array.from({ length: ROWS * COLS }).map((_, index) => (
            <div
              key={index}
              className="h-16 sm:h-20 md:h-24 border-b-2 border-slate-400 bg-white flex items-center justify-center p-1 relative transition-colors focus-within:bg-amber-100/60"
            >
              <input
                type="number"
                value={cells[index]}
                onChange={(e) => onCellChange(gridId, index, e.target.value)}
                placeholder=""
                className="w-full h-full text-center text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 focus:outline-none focus:text-blue-700 bg-transparent rounded select-all"
                aria-label={`Cell ${index + 1}`}
              />
            </div>
          ))}
          {/* Sum Row */}
          {columnSums.map((sum, index) => (
            <div
              key={`sum-${index}`}
              className="h-16 sm:h-20 md:h-24 bg-slate-200/90 flex flex-col items-center justify-center px-1 text-center font-extrabold select-none border-t-2 border-slate-600"
            >
              <span className="text-xs sm:text-sm text-slate-600 font-semibold mb-0.5">សរុប</span>
              <span className="text-xl sm:text-2xl md:text-3xl text-slate-900 truncate w-full text-center px-1">
                {sum.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataTable;