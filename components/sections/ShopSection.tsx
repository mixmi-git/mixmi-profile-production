"use client";

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import ShopCard from '../cards/ShopCard';
import ShopItemModal from '../modals/ShopItemModal';
import SectionEditorModal from '../modals/SectionEditorModal';
import { ShopItem } from '@/types';
import EmptyItemCard from '../shared/EmptyItemCard';

export default function ShopSection() {
  const { profile, updateProfile, shopItems, addShopItem, updateShopItem, removeShopItem, updateAllShopItems } = useProfile();
  const { isAuthenticated } = useAuth();
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | undefined>(undefined);
  
  const handleEdit = (item: ShopItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };
  
  // Special handler for editing from the section editor modal
  const handleEditFromEditor = (item: ShopItem) => {
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
  
  const handleSave = (item: ShopItem) => {
    if (editingItem) {
      updateShopItem(item.id, item);
    } else {
      addShopItem(item);
    }
  };
  
  const handleUpdateItems = (items: ShopItem[]) => {
    // Use the new bulk update method
    updateAllShopItems(items);
  };
  
  const handleUpdateSectionTitle = (newTitle: string) => {
    updateProfile({
      sectionTitles: {
        ...profile.sectionTitles,
        shop: newTitle
      }
    });
  };
  
  return (
    <section className="max-w-6xl mx-auto mb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider">{profile.sectionTitles.shop}</h2>
        {isAuthenticated && (
          <>
            <p className="text-gray-400 text-sm mt-1 mb-2">Share your products, services, and token-gated content</p>
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
        {shopItems.map((item) => (
          <ShopCard 
            key={item.id} 
            item={item} 
            onEdit={isAuthenticated ? () => handleEdit(item) : undefined}
            onDelete={isAuthenticated ? () => removeShopItem(item.id) : undefined}
          />
        ))}
        
        {isAuthenticated && shopItems.length < 3 && (
          <EmptyItemCard 
            onClick={handleAdd}
            aspectRatio="square"
          />
        )}
        
        {shopItems.length === 0 && !isAuthenticated && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">No shop items to display</p>
          </div>
        )}
      </div>
      
      {/* Individual item edit modal */}
      <ShopItemModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        item={editingItem}
        onSave={handleSave}
      />
      
      {/* Section editor modal with reordering */}
      <SectionEditorModal<ShopItem>
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title={profile.sectionTitles.shop}
        items={shopItems}
        onUpdateItems={handleUpdateItems}
        onAddItem={handleAddFromEditor}
        onEditItem={handleEditFromEditor}
        onDeleteItem={removeShopItem}
        imageField="image"
        sectionKey="shop"
        onUpdateSectionTitle={handleUpdateSectionTitle}
      />
    </section>
  );
} 