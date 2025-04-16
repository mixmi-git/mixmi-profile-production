"use client";

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import MediaCard from '../cards/MediaCard';
import MediaItemModal from '../modals/MediaItemModal';
import { MediaItem } from '@/types';

export default function MediaSection() {
  const { mediaItems, addMediaItem, updateMediaItem, removeMediaItem } = useProfile();
  const { isAuthenticated } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | undefined>(undefined);
  
  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const handleAdd = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };
  
  const handleSave = (item: MediaItem) => {
    if (editingItem) {
      updateMediaItem(item.id, item);
    } else {
      addMediaItem(item);
    }
  };
  
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-wider text-white">Media</h2>
          {isAuthenticated && (
            <p className="text-gray-400 text-sm mt-1">Share your videos, music, and podcasts</p>
          )}
        </div>
        
        {isAuthenticated && (
          <button 
            onClick={handleAdd}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1 rounded-md flex items-center space-x-2 transition-colors text-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Edit Section</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <MediaCard 
            key={item.id} 
            item={item} 
            onEdit={isAuthenticated ? () => handleEdit(item) : undefined}
            onDelete={isAuthenticated ? () => removeMediaItem(item.id) : undefined}
          />
        ))}
        
        {isAuthenticated && (
          <div 
            className="rounded-md border-2 border-dashed border-slate-700 flex items-center justify-center cursor-pointer hover:border-slate-600 transition-colors h-full min-h-[200px]"
            onClick={handleAdd}
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-cyan-400"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <p className="text-gray-400">Add Media</p>
            </div>
          </div>
        )}
        
        {mediaItems.length === 0 && !isAuthenticated && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">No media items to display</p>
          </div>
        )}
      </div>
      
      <MediaItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={editingItem}
        onSave={handleSave}
      />
    </section>
  );
} 