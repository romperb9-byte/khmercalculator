import React, { useMemo } from 'react';

interface InfoFormProps {
  sheetTotalWeight: number;
  date: string;
  price: string;
  name: string;
  onFormChange: (field: 'date' | 'price' | 'nameInput', value: string) => void;
}

const InfoForm: React.FC<InfoFormProps> = ({ sheetTotalWeight, date, price, name, onFormChange }) => {

  const totalPrice = useMemo(() => {
    const numericPrice = parseFloat(price) || 0;
    return numericPrice * sheetTotalWeight;
  }, [price, sheetTotalWeight]);

  return (
    <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Field */}
        <div className="flex flex-col">
          <label className="text-xs sm:text-sm font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            កាលបរិច្ឆេទ (ថ្ងៃទី)
          </label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => onFormChange('date', e.target.value)}
            className="w-full h-11 px-3 bg-white border border-slate-300 rounded-lg shadow-sm text-sm sm:text-base font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            aria-label="Date"
          />
        </div>

        {/* Name Field */}
        <div className="flex flex-col">
          <label className="text-xs sm:text-sm font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            ឈ្មោះអតិថិជន
          </label>
          <input 
            type="text"
            placeholder="បញ្ចូលឈ្មោះ..."
            value={name}
            onChange={(e) => onFormChange('nameInput', e.target.value)}
            className="w-full h-11 px-3 bg-white border border-slate-300 rounded-lg shadow-sm text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            aria-label="Name"
          />
        </div>

        {/* Price Field */}
        <div className="flex flex-col sm:col-span-2 lg:col-span-1">
          <label className="text-xs sm:text-sm font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            តម្លៃក្នុងមួយឯកតា
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => onFormChange('price', e.target.value)}
            className="w-full h-11 px-3 bg-white border border-slate-300 rounded-lg shadow-sm text-sm sm:text-base font-bold text-slate-800 text-left sm:text-right focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            aria-label="Price"
          />
        </div>
      </div>

      {/* Summary Stat Cards for Active Sheet */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-slate-200 shadow-xs flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-500">ទម្ងន់សរុប (សន្លឹកនេះ)</span>
          <span className="text-lg sm:text-2xl font-bold text-slate-800 truncate mt-0.5">
            {sheetTotalWeight.toLocaleString()}
          </span>
        </div>
        <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-slate-200 shadow-xs flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-500">តម្លៃសរុប (សន្លឹកនេះ)</span>
          <span className="text-lg sm:text-2xl font-bold text-emerald-600 truncate mt-0.5">
            {totalPrice.toLocaleString()}៛
          </span>
        </div>
      </div>
    </div>
  );
};

export default InfoForm;