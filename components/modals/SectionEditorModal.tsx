"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useDrag, useDrop } from "react-dnd";
import Image from "next/image";

interface Item {
  id: string;
  title?: string;
  [key: string]: any;
}

interface SectionEditorModalProps<T extends Item> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: T[];
  onUpdateItems: (items: T[]) => void;
  onAddItem: () => void;
  onEditItem: (item: T) => void;
  onDeleteItem: (id: string) => void;
  imageField?: string;
}

interface DraggableItemProps<T extends Item> {
  item: T;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  imageField?: string;
}

const ItemType = "SECTION_ITEM";

function DraggableItem<T extends Item>({ item, index, moveItem, onEdit, onDelete, imageField = "image" }: DraggableItemProps<T>) {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => ({ index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(dragItem: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = dragItem.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      moveItem(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      dragItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref}
      className={`flex items-center gap-4 p-3 rounded-md mb-2 ${isDragging ? 'opacity-50 bg-slate-700' : 'bg-slate-800'} cursor-move border border-slate-700`}
    >
      <div className="text-slate-500 flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </div>
      
      <div className="relative w-12 h-12 overflow-hidden rounded-md border border-slate-700 flex-shrink-0">
        {item[imageField] ? (
          <Image 
            src={item[imageField]} 
            alt={item.title || 'No title'} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <span className="text-slate-500 text-xs">No image</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(item)}
          className="p-1 rounded-full bg-slate-700 hover:bg-slate-600"
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
            className="text-cyan-400"
          >
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>
        
        <button 
          onClick={() => onDelete(item.id)}
          className="p-1 rounded-full bg-slate-700 hover:bg-slate-600"
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
      </div>
    </div>
  );
}

export default function SectionEditorModal<T extends Item>({
  isOpen,
  onClose,
  title,
  items,
  onUpdateItems,
  onAddItem,
  onEditItem,
  onDeleteItem,
  imageField = "image"
}: SectionEditorModalProps<T>) {
  const [localItems, setLocalItems] = useState<T[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLocalItems([...items]);
    }
  }, [isOpen, items]);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const dragItem = localItems[dragIndex];
    const newItems = [...localItems];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setLocalItems(newItems);
  };

  const handleSave = () => {
    onUpdateItems(localItems);
    onClose();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      onDeleteItem(id);
      setLocalItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage ${title}`}>
      <div className="space-y-4">
        <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2">
          {localItems.length > 0 ? (
            <div className="space-y-2">
              {localItems.map((item, index) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  index={index}
                  moveItem={moveItem}
                  onEdit={onEditItem}
                  onDelete={handleDelete}
                  imageField={imageField}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-800 rounded-md">
              <p className="text-gray-400">No items added yet</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            onClick={onAddItem}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-md flex items-center space-x-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add New Item</span>
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-700 rounded-md text-gray-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
          >
            Save Order
          </button>
        </div>
      </div>
    </Modal>
  );
} 