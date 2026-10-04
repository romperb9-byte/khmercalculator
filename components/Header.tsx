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
    <header className="bg-gradient-to-r from-sky-500 to-blue-600 p-2.5 sm:p-3.5 text-white rounded-t-xl shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Tabs & Actions */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {sheets.map(sheet => {
            const isActive = activeSheetId === sheet.id;
            return (
              <button
                key={sheet.id}
                onClick={() => onSelectSheet(sheet.id)}
                onDoubleClick={() => handleDoubleClick(sheet.id, sheet.name)}
                className={`group font-semibold text-xs sm:text-sm py-1.5 pl-3 pr-2 rounded-lg transition-all flex items-center space-x-1.5 shadow-xs ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-sm ring-2 ring-white/50'
                    : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-xs'
                }`}
                title="ចុចពីរដង (Double click) ដើម្បីប្តូរឈ្មោះ"
              >
                {editingSheetId === sheet.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent text-blue-800 font-bold outline-none border-b-2 border-blue-500 w-24 text-xs sm:text-sm p-0"
                  />
                ) : (
                  <span>{sheet.name}</span>
                )}

                {sheets.length > 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`តើអ្នកពិតជាចង់លុប "${sheet.name}" មែនទេ?`)) {
                        onDeleteSheet(sheet.id);
                      }
                    }}
                    className={`rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors ${
                      isActive 
                        ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' 
                        : 'text-white/60 hover:text-white hover:bg-black/20'
                    }`}
                    aria-label={`Delete ${sheet.name}`}
                  >
                    ×
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={onAddSheet}
            className="bg-white/20 hover:bg-white/30 text-white font-medium text-xs sm:text-sm py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1 border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>សន្លឹកថ្មី</span>
          </button>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1 ml-auto sm:ml-2 bg-black/10 rounded-lg p-0.5 border border-white/10">
            <button 
              onClick={onUndo} 
              disabled={!canUndo}
              title="មិនធ្វើវិញ (Undo)"
              className="p-1.5 sm:p-2 rounded-md hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-white"
              aria-label="Undo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2m0 0l-4-4m4 4l4-4" />
              </svg>
            </button>
            <button 
              onClick={onRedo} 
              disabled={!canRedo}
              title="ធ្វើវិញ (Redo)"
              className="p-1.5 sm:p-2 rounded-md hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-white"
              aria-label="Redo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a5 5 0 00-5 5v2m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
            <button 
              onClick={handleDownloadClick}
              title="ទាញយកជា Excel (.xlsx)"
              className="p-1.5 sm:p-2 rounded-md hover:bg-white/20 transition-colors text-white"
              aria-label="Download All Sheets as Excel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm bg-black/15 px-3 py-1.5 rounded-lg border border-white/10 self-start md:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-white/80 font-medium">ទម្ងន់សរុបទាំងអស់:</span>
            <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">
              {totalWeight.toLocaleString()}
            </span>
          </div>
          {sheets.length > 1 && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
              <span className="text-white/80 font-medium">តម្លៃសរុប:</span>
              <span className="font-bold text-emerald-200 bg-white/20 px-2 py-0.5 rounded">
                {totalPrice.toLocaleString()}៛
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;