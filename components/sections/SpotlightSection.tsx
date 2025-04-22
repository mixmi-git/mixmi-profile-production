"use client";

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import SpotlightCard from '../cards/SpotlightCard';
import SpotlightItemModal from '../modals/SpotlightItemModal';
import SectionEditorModal from '../modals/SectionEditorModal';
import { SpotlightItem } from '@/types';

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider">Spotlight</h2>
          <p className="text-gray-400 text-sm mt-1 mb-6">Share your work and favorite projects</p>
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
        {spotlightItems.map((item) => (
          <SpotlightCard 
            key={item.id} 
            item={item} 
            onEdit={isAuthenticated ? () => handleEdit(item) : undefined}
            onDelete={isAuthenticated ? () => removeSpotlightItem(item.id) : undefined}
          />
        ))}
        
        {isAuthenticated && spotlightItems.length < 3 && (
          <div 
            className="w-80 aspect-square rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer hover:border-accent transition-colors"
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
              <p className="text-gray-400">Add Item</p>
            </div>
          </div>
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