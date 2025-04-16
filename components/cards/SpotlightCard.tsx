"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { SpotlightItem } from '@/types';

interface SpotlightCardProps {
  item: SpotlightItem;
  onEdit?: () => void;
}

export default function SpotlightCard({ item, onEdit }: SpotlightCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative aspect-square rounded-md overflow-hidden bg-slate-800 border border-slate-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.image ? (
        <Image 
          src={item.image} 
          alt={item.title} 
          fill 
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
          <span className="text-slate-500">No Image</span>
        </div>
      )}
      
      <div className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-slate-900/90 to-slate-900/0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-100'}`}>
        <div className="flex items-start">
          <div className="border-l-2 border-cyan-400 pl-2">
            <h3 className="text-white font-medium text-sm">{item.title}</h3>
            {isHovered && item.description && (
              <p className="text-gray-300 text-xs mt-1">{item.description}</p>
            )}
          </div>
        </div>
      </div>
      
      {onEdit && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 right-2 bg-slate-800/70 p-1 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-cyan-400"
          >
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>
      )}
    </div>
  );
} 