import React from 'react';
import { FaRegListAlt } from 'react-icons/fa';

export default function EmptyState({ 
  title = "No data found", 
  description = "There is no data to display at this time.", 
  icon: Icon = FaRegListAlt,
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Icon size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-6">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2 bg-primaryA0 text-white rounded-lg hover:bg-primaryA0/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryA0"
        >
          {actionText}
        </button>
      )}
    </div>
  );
} 