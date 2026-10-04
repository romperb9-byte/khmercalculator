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
    <div className="grid grid-cols-6 border-t border-l border-black">
      {/* Editable Cells */}
      {Array.from({ length: ROWS * COLS }).map((_, index) => (
        <div
          key={index}
          className="aspect-square border-r border-b border-black bg-white flex items-center justify-center"
        >
          <input
            type="number"
            value={cells[index]}
            onChange={(e) => onCellChange(gridId, index, e.target.value)}
            className="w-full h-full text-center text-lg font-medium focus:outline-none focus:bg-yellow-100 bg-white"
            aria-label={`Cell ${index + 1}`}
          />
        </div>
      ))}
      {/* Sum Row */}
      {columnSums.map((sum, index) => (
        <div
          key={`sum-${index}`}
          className="aspect-square border-r border-b border-black bg-gray-300 flex items-center justify-center text-lg font-bold"
        >
          {sum.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default DataTable;