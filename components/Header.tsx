import React, { useState } from 'react';

interface Sheet {
  id: number;
  name: string;
}

interface HeaderProps {
  sheets: Sheet[];
  activeSheetId: number;
  onSelectSheet: (id: number) => void;
  onAddSheet: () => void;
  onDeleteSheet: (id: number) => void;
  onRenameSheet: (id: number, newName: string) => void;
  totalWeight: number;
  totalPrice: number;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  sheets, 
  activeSheetId, 
  onSelectSheet, 
  onAddSheet, 
  onDeleteSheet, 
  onRenameSheet,
  totalWeight,
  totalPrice,
  onUndo,
  onRedo,
  onDownload,
  canUndo,
  canRedo
}) => {
  const [editingSheetId, setEditingSheetId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleDownloadClick = () => {
    if (window.confirm("ទាញយកជា Excel?")) {
      onDownload();
    }
  };

  const handleDoubleClick = (id: number, name: string) => {
    setEditingSheetId(id);
    setEditingName(name);
  };

  const handleRename = () => {
    if (editingSheetId !== null && editingName.trim()) {
      onRenameSheet(editingSheetId, editingName.trim());
    }
    setEditingSheetId(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditingSheetId(null);
    }
  };

  return (
    <header className="bg-sky-300 p-2 flex flex-wrap justify-between items-center rounded-t-lg gap-2">
      <div className="flex items-center flex-wrap gap-2">
        {sheets.map(sheet => (
          <button
            key={sheet.id}
            onClick={() => onSelectSheet(sheet.id)}
            onDoubleClick={() => handleDoubleClick(sheet.id, sheet.name)}
            className={`font-semibold py-1 pl-3 pr-2 rounded-md shadow-sm transition-colors flex items-center space-x-1 ${
              activeSheetId === sheet.id
                ? 'bg-white'
                : 'bg-sky-400 hover:bg-sky-500'
            }`}
            title="Double-click to rename"
          >
            {editingSheetId === sheet.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                autoFocus
                onClick={(e) => e.stopPropagation()} // Prevent sheet selection when clicking input
                className="bg-transparent outline-none p-0 border-0 w-24"
              />
            ) : (
              <span>{sheet.name}</span>
            )}

            {sheets.length > 1 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSheet(sheet.id);
                }}
                className="text-base rounded-full w-5 h-5 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-black/20"
                aria-label={`Delete ${sheet.name}`}
              >
                &times;
              </span>
            )}
          </button>
        ))}
        <button
          onClick={onAddSheet}
          className="bg-sky-400 font-semibold py-1 px-3 rounded-md hover:bg-sky-500 transition-colors"
        >
          +សន្លឹកថ្មី
        </button>

        <div className="flex items-center gap-1 ml-2">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            title="មិនធ្វើវិញ (Undo)"
            className="p-2 rounded-md hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Undo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 015 5v1" />
            </svg>
          </button>
          <button 
            onClick={onRedo} 
            disabled={!canRedo}
            title="ធ្វើវិញ (Redo)"
            className="p-2 rounded-md hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Redo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 15l3-3m0 0l-3-3m3 3H8a5 5 0 00-5 5v1" />
            </svg>
          </button>
          <button 
            onClick={handleDownloadClick}
            title="ទាញយកគ្រប់សន្លឹកជា Excel"
            className="p-2 rounded-md hover:bg-sky-500 transition-colors"
            aria-label="Download All Sheets as Excel"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-base">
            ទម្ងន់សរុបគ្រប់សន្លឹក
          </span>
          <span className="font-bold text-base">{totalWeight.toLocaleString()}</span>
        </div>
        {sheets.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-base">
              តម្លៃសរុបគ្រប់សន្លឹក
            </span>
            <span className="font-bold text-base">{totalPrice.toLocaleString()}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;