"use client";

import React from 'react';
import { MediaItem } from '@/types';

interface MediaCardProps {
  item: MediaItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Helper to get embed component based on media type
const getMediaEmbed = (item: MediaItem) => {
  if (!item.embedUrl) return null;
  
  switch(item.type.toLowerCase()) {
    case 'youtube':
      return (
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={item.embedUrl}
            title={item.title || "YouTube Video"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      );
    case 'spotify':
      return (
        <div className="w-full">
          <iframe
            src={item.embedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            title={item.title || "Spotify Track"}
            className="w-full"
          ></iframe>
        </div>
      );
    case 'soundcloud':
      return (
        <div className="w-full">
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            src={item.embedUrl}
            title={item.title || "SoundCloud Track"}
            className="w-full"
          ></iframe>
        </div>
      );
    case 'mixcloud':
      return (
        <div className="w-full">
          <iframe
            width="100%"
            height="180"
            src={item.embedUrl}
            frameBorder="0"
            allow="autoplay"
            title={item.title || "Mixcloud Track"}
            className="w-full"
          ></iframe>
        </div>
      );
    case 'apple-music':
      return (
        <div className="w-full">
          <iframe
            src={item.embedUrl}
            width="100%"
            height="175"
            frameBorder="0"
            allow="autoplay *; encrypted-media *;"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            title={item.title || "Apple Music Track"}
            className="w-full"
          ></iframe>
        </div>
      );
    default:
      return (
        <div className="bg-slate-800 p-4 flex items-center justify-center h-40 w-full">
          <p>Unsupported media type</p>
        </div>
      );
  }
};

export default function MediaCard({ item, onEdit, onDelete }: MediaCardProps) {
  return (
    <div className="w-80 rounded-lg overflow-hidden border border-gray-700 hover:border-accent transition-colors group">
      <div className="media-content w-full">
        {getMediaEmbed(item)}
      </div>
      
      {item.title && (
        <div className="p-2 bg-gradient-to-t from-slate-900/90 to-slate-900/0">
          <h3 className="text-white font-medium">{item.title}</h3>
        </div>
      )}
      
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-slate-800/70 p-1 rounded-full"
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
              className="bg-slate-800/70 p-1 rounded-full"
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