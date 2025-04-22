"use client";

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import ShopCard from '../cards/ShopCard';
import ShopItemModal from '../modals/ShopItemModal';
import SectionEditorModal from '../modals/SectionEditorModal';
import { ShopItem } from '@/types';

export default function ShopSection() {
  const { shopItems, addShopItem, updateShopItem, removeShopItem, updateAllShopItems } = useProfile();
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
  
  return (
    <section className="max-w-6xl mx-auto mb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider">Shop</h2>
          {isAuthenticated && (
            <p className="text-gray-400 text-sm mt-1">Share products and services you offer</p>
          )}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
        {shopItems.map((item) => (
          <ShopCard 
            key={item.id} 
            item={item} 
            onEdit={isAuthenticated ? () => handleEdit(item) : undefined}
            onDelete={isAuthenticated ? () => removeShopItem(item.id) : undefined}
          />
        ))}
        
        {isAuthenticated && shopItems.length < 3 && (
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
        title="Shop"
        items={shopItems}
        onUpdateItems={handleUpdateItems}
        onAddItem={handleAddFromEditor}
        onEditItem={handleEditFromEditor}
        onDeleteItem={removeShopItem}
        imageField="image"
      />
    </section>
  );
} 