"use client";

import React from 'react';
import { MediaItem } from '@/types';

interface MediaCardProps {
  item: MediaItem;
  onEdit?: () => void;
}

// Helper to get embed component based on media type
const getMediaEmbed = (item: MediaItem) => {
  if (!item.embedUrl) return null;
  
  switch(item.type.toLowerCase()) {
    case 'youtube':
      return (
        <iframe
          width="100%"
          height="200"
          src={item.embedUrl}
          title={item.title || "YouTube Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    case 'spotify':
      return (
        <iframe
          src={item.embedUrl}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
          title={item.title || "Spotify Track"}
        ></iframe>
      );
    case 'soundcloud':
      return (
        <iframe
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          src={item.embedUrl}
          title={item.title || "SoundCloud Track"}
        ></iframe>
      );
    default:
      return (
        <div className="bg-slate-800 p-4 flex items-center justify-center h-40">
          <p>Unsupported media type</p>
        </div>
      );
  }
};

export default function MediaCard({ item, onEdit }: MediaCardProps) {
  return (
    <div className="relative w-full rounded-md overflow-hidden bg-slate-800 border border-slate-700">
      <div className="media-content">
        {getMediaEmbed(item)}
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