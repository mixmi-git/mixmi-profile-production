"use client";

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import MediaCard from '../cards/MediaCard';
import MediaItemModal from '../modals/MediaItemModal';
import SectionEditorModal from '../modals/SectionEditorModal';
import { MediaItem } from '@/types';

export default function MediaSection() {
  const { mediaItems, addMediaItem, updateMediaItem, removeMediaItem, updateAllMediaItems } = useProfile();
  const { isAuthenticated } = useAuth();
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | undefined>(undefined);
  
  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };
  
  // Special handler for editing from the section editor modal
  const handleEditFromEditor = (item: MediaItem) => {
    // First close the section editor modal
    setIsSectionModalOpen(false);
    
    // Then after a short delay, open the item modal for editing
    setTimeout(() => {
      setEditingItem(item);
      setIsItemModalOpen(true);
    }, 100);
  };
  
  const handleAdd = () => {
    setEditingItem(undefined);
    setIsItemModalOpen(true);
  };
  
  // Special handler for adding from the section editor modal
  const handleAddFromEditor = () => {
    // First close the section editor modal
    setIsSectionModalOpen(false);
    
    // Then after a short delay, open the item modal
    setTimeout(() => {
      setEditingItem(undefined);
      setIsItemModalOpen(true);
    }, 100);
  };
  
  const handleSave = (item: MediaItem) => {
    if (editingItem) {
      updateMediaItem(item.id, item);
    } else {
      addMediaItem(item);
    }
  };
  
  const handleUpdateItems = (items: MediaItem[]) => {
    // Use the new bulk update method
    updateAllMediaItems(items);
    // Log to confirm the update is happening
    console.log("Updating all media items:", items);
  };
  
  return (
    <section className="max-w-6xl mx-auto mb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider">Media</h2>
          <p className="text-gray-400 text-sm mt-1 mb-6">Share your videos, music, and podcasts</p>
        </div>
        
        {isAuthenticated && (
          <button 
            onClick={() => setIsSectionModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-accent px-3 py-1 rounded-md flex items-center space-x-2 transition-colors text-sm"
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-4">
        {mediaItems.map((item) => (
          <MediaCard 
            key={item.id} 
            item={item} 
            onEdit={isAuthenticated ? () => handleEdit(item) : undefined}
            onDelete={isAuthenticated ? () => removeMediaItem(item.id) : undefined}
          />
        ))}
        
        {isAuthenticated && mediaItems.length < 3 && (
          <div 
            className="w-80 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer hover:border-accent transition-colors min-h-[200px]"
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
                  className="text-accent"
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
      
      {/* Individual item edit modal */}
      <MediaItemModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        item={editingItem}
        onSave={handleSave}
      />
      
      {/* Section editor modal with reordering */}
      <SectionEditorModal<MediaItem>
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Media"
        items={mediaItems}
        onUpdateItems={handleUpdateItems}
        onAddItem={handleAddFromEditor}
        onEditItem={handleEditFromEditor}
        onDeleteItem={removeMediaItem}
        imageField="type"
      />
    </section>
  );
} 