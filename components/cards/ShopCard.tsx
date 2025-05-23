"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ShopItem } from '@/types';

interface ShopCardProps {
  item: ShopItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ShopCard({ item, onEdit, onDelete }: ShopCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCardClick = () => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div 
      className={`relative w-80 aspect-square rounded-lg overflow-hidden border-2 border-gray-700 hover:border-accent hover:border-[3px] transition-all group ${item.link ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={item.link ? handleCardClick : undefined}
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
      
      <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900/95 to-slate-900/0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-100'}`}>
        <div className="flex items-start">
          <div className="border-l-2 border-accent pl-2">
            <h3 className="text-white font-medium text-sm drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{item.title}</h3>
            {isHovered && item.description && (
              <p className="text-gray-200 text-xs mt-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{item.description}</p>
            )}
          </div>
        </div>
      </div>
      
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-slate-800/70 p-1 rounded-full hover:bg-slate-700/80"
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
                className="text-accent"
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
                if (confirm("Are you sure you want to delete this item?")) {
                  onDelete();
                }
              }}
              className="bg-slate-800/70 p-1 rounded-full hover:bg-slate-700/80"
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