import React from 'react';

interface EmptyItemCardProps {
  onClick: () => void;
  showLabel?: boolean;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'free';
  width?: string;
  minHeight?: string;
}

export default function EmptyItemCard({
  onClick,
  showLabel = false,
  label = "Add Item",
  aspectRatio = 'square',
  width = "w-80",
  minHeight
}: EmptyItemCardProps) {
  // Determine aspect ratio class
  const aspectRatioClass = 
    aspectRatio === 'square' ? 'aspect-square' : 
    aspectRatio === 'video' ? 'aspect-video' : '';
  
  return (
    <div 
      className={`${width} ${aspectRatioClass} ${minHeight || ''} rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors`}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-12 h-12 text-gray-500"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        {showLabel && (
          <p className="text-gray-500 text-sm mt-2">{label}</p>
        )}
      </div>
    </div>
  );
} 