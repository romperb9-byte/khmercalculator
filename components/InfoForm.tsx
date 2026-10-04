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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
      {/* Date Field */}
      <div className="flex flex-col sm:flex-row sm:items-center">
        <label className="font-semibold whitespace-nowrap text-lg">ថ្ងៃទី</label>
        <div className="relative flex-grow mt-1 sm:mt-0 sm:ml-4">
          <input 
            type="date" 
            value={date}
            onChange={(e) => onFormChange('date', e.target.value)}
            className="w-full py-1 bg-white border border-gray-400 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Date"
          />
        </div>
      </div>

      {/* Price Field */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="font-semibold whitespace-nowrap text-lg">តម្លៃ</label>
        <input
          type="number"
          value={price}
          onChange={(e) => onFormChange('price', e.target.value)}
          className="w-full sm:w-32 text-left sm:text-right font-bold text-lg py-1 mt-1 sm:mt-0 bg-white border border-gray-400 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Price"
        />
      </div>

      {/* Name Field */}
      <div className="flex flex-col sm:flex-row sm:items-center">
        <label className="font-semibold whitespace-nowrap text-lg">ឈ្មោះ</label>
        <div className="flex-grow mt-1 sm:mt-0 sm:ml-4">
          <input 
            type="text"
            value={name}
            onChange={(e) => onFormChange('nameInput', e.target.value)}
            className="w-full py-1 bg-white border border-gray-400 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Name"
          />
        </div>
      </div>

      {/* Total Weight Field */}
      <div className="flex items-center justify-between">
        <label className="font-semibold whitespace-nowrap text-lg">ទម្ងន់សរុប</label>
        <span className="font-bold text-lg">{sheetTotalWeight.toLocaleString()}</span>
      </div>

      {/* Total Price Field */}
      <div className="flex items-center justify-between sm:justify-start">
        <label className="font-semibold whitespace-nowrap text-lg">តម្លៃសរុប</label>
        <span className="font-bold text-lg sm:ml-4">{totalPrice.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default InfoForm;