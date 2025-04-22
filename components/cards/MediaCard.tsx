"use client";

import React, { useState } from 'react';
import { MediaItem } from '@/types';
import { ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MediaCard({ item, onEdit, onDelete }: MediaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Multiple media types can now be expanded
  const canExpand = ['soundcloud', 'apple-music', 'spotify'].includes(item.type?.toLowerCase() || '');
  
  // Base container class for all media types - matches YouTube dimensions
  const getContainerClass = () => {
    // Base styles with fixed width and YouTube aspect ratio
    const baseStyle = 'w-80 border-2 border-gray-700 hover:border-accent hover:border-[3px] transition-all rounded-lg overflow-hidden';
    
    // For expandable media that's expanded, use taller height
    if (canExpand && isExpanded) {
      return `${baseStyle} h-[400px]`;
    }
    
    // Default to YouTube dimensions for all cards
    return `${baseStyle} aspect-video`;
  };
  
  // Helper to get embed component based on media type
  const renderMedia = () => {
    if (!item.embedUrl) return null;
    
    switch(item.type?.toLowerCase()) {
      case 'youtube':
        return (
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
        );
      case 'spotify':
        return (
          <iframe
            src={item.embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="encrypted-media"
            title={item.title || "Spotify Track"}
            className="w-full h-full"
          ></iframe>
        );
      case 'soundcloud':
        return (
          <iframe
            width="100%"
            height="100%"
            scrolling="no"
            frameBorder="no"
            src={item.embedUrl}
            title={item.title || "SoundCloud Track"}
            className="w-full h-full"
          ></iframe>
        );
      case 'mixcloud':
        return (
          <iframe
            width="100%"
            height="100%"
            src={item.embedUrl}
            frameBorder="0"
            allow="autoplay"
            title={item.title || "Mixcloud Track"}
            className="w-full h-full"
          ></iframe>
        );
      case 'apple-music':
        return (
          <iframe
            src={item.embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay *; encrypted-media *;"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            title={item.title || "Apple Music Track"}
            className="w-full h-full"
          ></iframe>
        );
      default:
        return (
          <div className="bg-slate-800 p-4 flex items-center justify-center h-full w-full">
            <p>Unsupported media type</p>
          </div>
        );
    }
  };
  
  return (
    <div className={`relative ${getContainerClass()} group`}>
      {renderMedia()}
      
      {/* External link button */}
      {item.link && (
        <a 
          href={item.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 bg-background/60 hover:bg-background/80 p-1.5 rounded-full transition-colors"
          title="View original"
          onClick={(e) => e.stopPropagation()} // Prevent card click from triggering
        >
          <ExternalLink size={14} className="text-gray-300" />
        </a>
      )}
      
      {/* Expand button for expandable media types */}
      {canExpand && !item.link && (
        <button 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="absolute bottom-3 right-3 bg-background/60 hover:bg-background/80 p-1.5 rounded-full transition-colors"
          title={isExpanded ? "Show less" : "Show more tracks"}
        >
          {isExpanded ? 
            <ChevronUp size={14} className="text-gray-300" /> : 
            <ChevronDown size={14} className="text-gray-300" />
          }
        </button>
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