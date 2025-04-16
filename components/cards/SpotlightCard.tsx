"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { SpotlightItem } from '@/types';

interface SpotlightCardProps {
  item: SpotlightItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SpotlightCard({ item, onEdit, onDelete }: SpotlightCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative aspect-square rounded-md overflow-hidden bg-slate-800 border border-slate-700 group"
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
      
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex space-x-1">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-slate-800/70 p-1 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              aria-label="Edit"
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
          
          {onDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(confirm("Are you sure you want to delete this item?")) {
                  onDelete();
                }
              }}
              className="bg-slate-800/70 p-1 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              aria-label="Delete"
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
                className="text-red-400"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
} 