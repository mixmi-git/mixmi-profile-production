"use client";

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import SpotlightCard from '../cards/SpotlightCard';
import SpotlightItemModal from '../modals/SpotlightItemModal';
import SectionEditorModal from '../modals/SectionEditorModal';
import { SpotlightItem } from '@/types';
import EmptyItemCard from '../shared/EmptyItemCard';

export default function SpotlightSection() {
  const { spotlightItems, addSpotlightItem, updateSpotlightItem, removeSpotlightItem, updateAllSpotlightItems } = useProfile();
  const { isAuthenticated } = useAuth();
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SpotlightItem | undefined>(undefined);
  
  const handleEdit = (item: SpotlightItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };
  
  // Special handler for editing from the section editor modal
  const handleEditFromEditor = (item: SpotlightItem) => {
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
  
  const handleSave = (item: SpotlightItem) => {
    if (editingItem) {
      updateSpotlightItem(item.id, item);
    } else {
      addSpotlightItem(item);
    }
  };
  
  const handleUpdateItems = (items: SpotlightItem[]) => {
    // Use the new bulk update method
    updateAllSpotlightItems(items);
  };
  
  return (
    <section className="max-w-6xl mx-auto mb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Spotlight</h2>
        {isAuthenticated && (
          <>
            <p className="text-gray-400 text-sm mt-1 mb-2">Showcase your projects or amplify friends you collab with</p>
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
        {spotlightItems.map((item) => (
          <SpotlightCard 
            key={item.id} 
            item={item} 
            onEdit={isAuthenticated ? () => handleEdit(item) : undefined}
            onDelete={isAuthenticated ? () => removeSpotlightItem(item.id) : undefined}
          />
        ))}
        
        {isAuthenticated && spotlightItems.length < 3 && (
          <EmptyItemCard 
            onClick={handleAdd}
            aspectRatio="square"
          />
        )}
        
        {spotlightItems.length === 0 && !isAuthenticated && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">No spotlight items to display</p>
          </div>
        )}
      </div>
      
      {/* Individual item edit modal */}
      <SpotlightItemModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        item={editingItem}
        onSave={handleSave}
      />
      
      {/* Section editor modal with reordering */}
      <SectionEditorModal<SpotlightItem>
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Spotlight"
        items={spotlightItems}
        onUpdateItems={handleUpdateItems}
        onAddItem={handleAddFromEditor}
        onEditItem={handleEditFromEditor}
        onDeleteItem={removeSpotlightItem}
        imageField="image"
      />
    </section>
  );
} 