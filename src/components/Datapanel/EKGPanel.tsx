import React from 'react';

const EKGPanel = () => {
  return (
    <div className="h-full bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">EKG</h2>
      <div className="space-y-4">
        <p>EKG panel content goes here</p>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Heart Rate
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="bpm"
          />
        </div>
        
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save EKG Results
        </button>
      </div>
    </div>
  );
};

export default EKGPanel;