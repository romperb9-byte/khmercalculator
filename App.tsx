import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import InfoForm from './components/InfoForm';
import DataTable from './components/DataTable';

// For XLSX library from CDN
declare const XLSX: any;

interface DataGrid {
  id: number;
  cells: string[];
}

interface Sheet {
  id: number;
  name: string;
  dataGrids: DataGrid[];
  date: string;
  price: string;
  nameInput: string;
}

// Unified state for the entire application
interface AppState {
  sheets: Sheet[];
  activeSheetId: number;
}

// History state wrapper
interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

const App: React.FC = () => {
  // A single state for history which holds the entire app state
  const [history, setHistory] = useState<History<AppState>>(() => {
    try {
      const savedState = localStorage.getItem('khmerCalculatorState');
      if (savedState) {
        const parsedState: AppState = JSON.parse(savedState);
        // Basic validation
        if (parsedState && Array.isArray(parsedState.sheets) && typeof parsedState.activeSheetId === 'number') {
          return { past: [], present: parsedState, future: [] };
        }
      }
    } catch (error) {
      console.error("Could not load state from localStorage:", error);
    }
    // Default initial state if loading fails or no saved state exists
    const initialSheets: Sheet[] = [
      { 
        id: 1, 
        name: 'សន្លឹកទី១', 
        dataGrids: [{ id: Date.now(), cells: Array(30).fill('') }],
        date: '',
        price: '0',
        nameInput: ''
      },
    ];
    return {
      past: [],
      present: {
        sheets: initialSheets,
        activeSheetId: 1,
      },
      future: [],
    };
  });

  const { past, present, future } = history;
  const { sheets, activeSheetId } = present;

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Single function to update state and record history
  const setState = (updater: (prevState: AppState) => AppState) => {
    setHistory(currentHistory => {
        const newPresent = updater(currentHistory.present);

        // Don't update history if state is identical
        if (JSON.stringify(newPresent) === JSON.stringify(currentHistory.present)) {
            return currentHistory;
        }

        return {
            past: [...currentHistory.past, currentHistory.present],
            present: newPresent,
            future: [],
        };
    });
  };

  const handleUndo = () => {
    if (!canUndo) return;
    const previousState = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setHistory({
      past: newPast,
      present: previousState,
      future: [present, ...future],
    });
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const nextState = future[0];
    const newFuture = future.slice(1);
    setHistory({
      past: [...past, present],
      present: nextState,
      future: newFuture,
    });
  };

  // Save the current state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('khmerCalculatorState', JSON.stringify(present));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  }, [present]);

  const handleSelectSheet = (id: number) => {
    setState(prevState => ({ ...prevState, activeSheetId: id }));
  };
  
  const handleAddSheet = () => {
    setState(prevState => {
      const newSheetId = prevState.sheets.length > 0 ? Math.max(...prevState.sheets.map(t => t.id)) + 1 : 1;
      const newSheet: Sheet = {
        id: newSheetId,
        name: `សន្លឹកទី${newSheetId}`,
        dataGrids: [{ id: Date.now(), cells: Array(30).fill('') }],
        date: '',
        price: '0',
        nameInput: ''
      };
      return {
        sheets: [...prevState.sheets, newSheet],
        activeSheetId: newSheetId,
      };
    });
  };

  const handleDeleteSheet = (idToDelete: number) => {
    if (sheets.length <= 1) {
      return;
    }

    setState(prevState => {
      const { sheets, activeSheetId } = prevState;
      let newActiveId = activeSheetId;

      if (activeSheetId === idToDelete) {
        const deletedIndex = sheets.findIndex(sheet => sheet.id === idToDelete);
        if (deletedIndex > 0) {
          newActiveId = sheets[deletedIndex - 1].id;
        } else {
          // If the first sheet is deleted, select the new first sheet
          newActiveId = sheets[1].id;
        }
      }
      
      const newSheets = sheets.filter(sheet => sheet.id !== idToDelete);

      return {
        sheets: newSheets,
        activeSheetId: newActiveId,
      };
    });
  };

  const handleRenameSheet = (sheetId: number, newName: string) => {
    setState(prevState => ({
      ...prevState,
      sheets: prevState.sheets.map(sheet =>
        sheet.id === sheetId ? { ...sheet, name: newName } : sheet
      ),
    }));
  };

  const handleAddDataGrid = () => {
    setState(prevState => ({
      ...prevState,
      sheets: prevState.sheets.map(sheet => {
        if (sheet.id === prevState.activeSheetId) {
          const newDataGrid: DataGrid = { id: Date.now(), cells: Array(30).fill('') };
          return { ...sheet, dataGrids: [...sheet.dataGrids, newDataGrid] };
        }
        return sheet;
      }),
    }));
  };

  const handleClearSheetData = () => {
    if (window.confirm("សម្អាតទិន្នន័យ?")) {
      setState(prevState => ({
        ...prevState,
        sheets: prevState.sheets.map(sheet => {
          if (sheet.id === prevState.activeSheetId) {
            return { 
              ...sheet, 
              dataGrids: [{ id: Date.now(), cells: Array(30).fill('') }],
              date: '',
              price: '0',
              nameInput: ''
            };
          }
          return sheet;
        }),
      }));
    }
  };

  const handleCellChange = (gridId: number, cellIndex: number, value: string) => {
    setState(prevState => ({
      ...prevState,
      sheets: prevState.sheets.map(sheet => {
        if (sheet.id === prevState.activeSheetId) {
          return {
            ...sheet,
            dataGrids: sheet.dataGrids.map(grid => {
              if (grid.id === gridId) {
                const newCells = [...grid.cells];
                newCells[cellIndex] = value;
                return { ...grid, cells: newCells };
              }
              return grid;
            }),
          };
        }
        return sheet;
      }),
    }));
  };
  
  const handleFormChange = (field: keyof Sheet, value: string) => {
    setState(prevState => ({
      ...prevState,
      sheets: prevState.sheets.map(sheet => 
        sheet.id === prevState.activeSheetId ? { ...sheet, [field]: value } : sheet
      ),
    }));
  };
  
  const handleDownloadExcel = () => {
    const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);
    if (!activeSheet) return;

    const wb = XLSX.utils.book_new();

    sheets.forEach(sheet => {
      const sheetTotalWeight = sheet.dataGrids.reduce((total, grid) => 
          total + grid.cells.reduce((acc, val) => acc + (parseFloat(val) || 0), 0), 0);
      const totalPrice = (parseFloat(sheet.price) || 0) * sheetTotalWeight;

      const data: (string | number)[][] = [
        ['សន្លឹក', sheet.name],
        ['ថ្ងៃទី', sheet.date],
        ['ឈ្មោះ', sheet.nameInput],
        [],
        ['តម្លៃ', sheet.price],
        ['ទម្ងន់សរុប', sheetTotalWeight],
        ['តម្លៃសរុប', totalPrice],
        [], 
      ];
      
      const COLS = 6;
      const ROWS = 5;

      sheet.dataGrids.forEach((grid, gridIndex) => {
        data.push([`តារាងទី ${gridIndex + 1}`]);
        const columnSums = Array(COLS).fill(0);
        
        for (let row = 0; row < ROWS; row++) {
          const rowData: (string | number)[] = [];
          for (let col = 0; col < COLS; col++) {
            const cellIndex = row * COLS + col;
            const cellValue = parseFloat(grid.cells[cellIndex]) || '';
            rowData.push(cellValue);
            if(typeof cellValue === 'number') {
              columnSums[col] += cellValue;
            }
          }
          data.push(rowData);
        }
        const sumRow = ['សរុប'];
        columnSums.forEach(s => sumRow.push(s));
        data.push(sumRow);
        data.push([]); 
      });

      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    });

    const baseName = activeSheet.nameInput.trim() || 'Calculator_Export';
    // Sanitize filename by removing characters that are invalid in filenames
    const sanitizedBaseName = baseName.replace(/[\/\\?%*:|"<>]/g, '-');
    const fileName = `${sanitizedBaseName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);

  const { totalWeightForActiveSheet, totalWeightForAllSheets, totalPriceForAllSheets } = useMemo(() => {
    const sumCells = (cells: string[]): number => {
      return cells.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    };

    let totalWeightForAllSheets = 0;
    let totalPriceForAllSheets = 0;
    let totalWeightForActiveSheet = 0;

    sheets.forEach(sheet => {
      const sheetTotalWeight = sheet.dataGrids.reduce((total, grid) => total + sumCells(grid.cells), 0);
      const sheetPrice = parseFloat(sheet.price) || 0;
      const sheetTotalPrice = sheetTotalWeight * sheetPrice;
      
      totalWeightForAllSheets += sheetTotalWeight;
      totalPriceForAllSheets += sheetTotalPrice;
      
      if (sheet.id === activeSheetId) {
        totalWeightForActiveSheet = sheetTotalWeight;
      }
    });
    
    return { totalWeightForActiveSheet, totalWeightForAllSheets, totalPriceForAllSheets };
  }, [sheets, activeSheetId]);


  return (
    <div className="bg-gray-100 min-h-screen flex items-start justify-center p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-6xl mx-auto shadow-lg text-black">
        <Header
          sheets={sheets}
          activeSheetId={activeSheetId}
          onSelectSheet={handleSelectSheet}
          onAddSheet={handleAddSheet}
          onDeleteSheet={handleDeleteSheet}
          onRenameSheet={handleRenameSheet}
          totalWeight={totalWeightForAllSheets}
          totalPrice={totalPriceForAllSheets}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDownload={handleDownloadExcel}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-b-lg border-2 border-t-0 border-green-400">
          {activeSheet && (
            <div key={activeSheetId}>
              <InfoForm 
                sheetTotalWeight={totalWeightForActiveSheet}
                date={activeSheet.date}
                price={activeSheet.price}
                name={activeSheet.nameInput}
                onFormChange={handleFormChange}
              />
              {activeSheet.dataGrids.map(grid => (
                <div key={grid.id} className="mt-6 overflow-x-auto">
                  <DataTable 
                    gridId={grid.id}
                    cells={grid.cells}
                    onCellChange={handleCellChange}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:space-x-6">
            <button
              onClick={handleAddDataGrid}
              className="hover:underline transition-all text-lg font-semibold text-left sm:text-center"
            >
              + បន្ថែមតារាង
            </button>
            <button
              onClick={handleClearSheetData}
              className="hover:underline transition-all text-lg font-semibold text-left sm:text-center"
            >
              សម្អាតទិន្នន័យ
            </button>
            <span className="text-blue-600">(create by sorn vichit 0977414905)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;