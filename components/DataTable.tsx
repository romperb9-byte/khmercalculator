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
    <div className="w-full overflow-x-auto pb-1">
      <div className="min-w-[500px] sm:min-w-[600px] border border-gray-400 rounded-lg overflow-hidden shadow-sm bg-white">
        <div className="grid grid-cols-6 divide-x divide-gray-300">
          {/* Editable Cells */}
          {Array.from({ length: ROWS * COLS }).map((_, index) => (
            <div
              key={index}
              className="h-12 sm:h-14 md:h-16 border-b border-gray-300 bg-white flex items-center justify-center p-0.5 relative group"
            >
              <input
                type="number"
                value={cells[index]}
                onChange={(e) => onCellChange(gridId, index, e.target.value)}
                placeholder=""
                className="w-full h-full text-center text-base sm:text-lg md:text-xl font-semibold text-gray-800 focus:outline-none focus:bg-amber-50 focus:text-blue-700 transition-colors bg-transparent rounded"
                aria-label={`Cell ${index + 1}`}
              />
            </div>
          ))}
          {/* Sum Row */}
          {columnSums.map((sum, index) => (
            <div
              key={`sum-${index}`}
              className="h-12 sm:h-14 md:h-16 bg-slate-100 flex flex-col items-center justify-center px-1 text-center font-bold text-sm sm:text-base md:text-lg text-slate-800 select-none border-t-2 border-slate-300"
            >
              <span className="text-[10px] text-slate-500 font-medium sm:hidden">សរុប</span>
              <span className="truncate w-full text-center">{sum.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataTable;