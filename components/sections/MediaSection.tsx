"use client";

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import MediaCard from '../cards/MediaCard';
import MediaItemModal from '../modals/MediaItemModal';
import SectionEditorModal from '../modals/SectionEditorModal';
import { MediaItem } from '@/types';
import EmptyItemCard from '../shared/EmptyItemCard';

export default function MediaSection() {
  const { profile, updateProfile, mediaItems, addMediaItem, updateMediaItem, removeMediaItem, updateAllMediaItems } = useProfile();
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
  };
  
  const handleUpdateSectionTitle = (newTitle: string) => {
    updateProfile({
      sectionTitles: {
        ...profile.sectionTitles,
        media: newTitle
      }
    });
  };

  return (
    <section className="max-w-6xl mx-auto mb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider">{profile.sectionTitles.media}</h2>
        {isAuthenticated && (
          <>
            <p className="text-gray-400 text-sm mt-1 mb-2">Share your music, videos, mixes — supports YouTube, Spotify, SoundCloud, Mixcloud, and more</p>
            <button 
              onClick={() => setIsSectionModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-accent px-3 py-1 rounded-md flex items-center space-x-2 transition-colors text-sm mt-2"
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
          </>
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
        
        {isAuthenticated && mediaItems.length < 6 && (
          <EmptyItemCard 
            onClick={handleAdd}
            aspectRatio="video"
          />
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
        title={profile.sectionTitles.media}
        items={mediaItems}
        onUpdateItems={handleUpdateItems}
        onAddItem={handleAddFromEditor}
        onEditItem={handleEditFromEditor}
        onDeleteItem={removeMediaItem}
        imageField="thumbnailUrl"
        sectionKey="media"
        onUpdateSectionTitle={handleUpdateSectionTitle}
        maxItems={6}
      />
    </section>
  );
} 