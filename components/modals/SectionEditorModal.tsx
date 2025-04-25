"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useDrag, useDrop } from "react-dnd";
import Image from "next/image";
import { Youtube, Music } from "lucide-react";
import { 
  FaSoundcloud, 
  FaMixcloud,
  FaApple
} from "react-icons/fa6";

interface Item {
  id: string;
  title?: string;
  type?: string;
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
  sectionKey?: string;
  onUpdateSectionTitle?: (title: string) => void;
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

// Helper to check if a string is a valid image URL or path
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  // Check if it's an absolute URL or a valid path starting with /
  return url.startsWith('http') || url.startsWith('https') || url.startsWith('/') || url.startsWith('data:image');
};

// Helper to get media type icon component
const getMediaTypeIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'youtube':
      return <Youtube size={20} className="text-[#FF0000]" />;
    case 'spotify':
      return <Music size={20} className="text-[#1DB954]" />;
    case 'soundcloud':
      return <FaSoundcloud size={20} className="text-[#FF7700]" />;
    case 'mixcloud':
      return <FaMixcloud size={20} className="text-[#5000FF]" />;
    case 'apple-music':
      return <FaApple size={20} className="text-[#FA243C]" />;
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
      );
  }
};

function DraggableItem<T extends Item>({ item, index, moveItem, onEdit, onDelete, imageField = "image" }: DraggableItemProps<T>) {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => ({ id: item.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(dragItem: { id: string, index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = dragItem.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset?.y ? clientOffset.y - hoverBoundingRect.top : 0;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      dragItem.index = hoverIndex;
    },
  });

  // Apply both drag and drop refs to the same element
  drag(drop(ref));

  // Check if the image field contains a valid image URL
  const hasValidImage = isValidImageUrl(item[imageField]);

  return (
    <div 
      ref={ref}
      className={`flex items-center gap-4 p-3 rounded-md mb-2 ${isDragging ? 'opacity-50 bg-slate-700' : 'bg-slate-800'} cursor-move border border-slate-700`}
    >
      <div 
        className="text-slate-500 flex items-center cursor-grab active:cursor-grabbing" 
        aria-label="Drag to reorder"
      >
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
        {hasValidImage ? (
          <Image 
            src={item[imageField]} 
            alt={item.title || 'No title'} 
            fill 
            className="object-cover"
          />
        ) : item.type ? (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            {getMediaTypeIcon(item.type)}
          </div>
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
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
  imageField = "image",
  sectionKey,
  onUpdateSectionTitle
}: SectionEditorModalProps<T>) {
  const [localItems, setLocalItems] = useState<T[]>([]);
  const [sectionTitle, setSectionTitle] = useState(title);

  useEffect(() => {
    if (isOpen) {
      setLocalItems([...items]);
      setSectionTitle(title);
    }
  }, [isOpen, items, title]);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const dragItem = localItems[dragIndex];
    const newItems = [...localItems];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setLocalItems(newItems);
  };

  const handleSave = () => {
    onUpdateItems(localItems);
    if (onUpdateSectionTitle && sectionTitle !== title) {
      onUpdateSectionTitle(sectionTitle);
    }
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
      <div className="space-y-8">
        {onUpdateSectionTitle && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Section Title
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              placeholder="Section Title"
            />
          </div>
        )}

        <div className="flex justify-end items-center mb-4">
          <span className="text-gray-400 text-sm">
            {localItems.length}/3 items
          </span>
        </div>

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

        {localItems.length < 3 && (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={onAddItem}
              className="flex items-center justify-center p-3 text-gray-500 hover:text-gray-400 transition-colors"
              aria-label="Add new item"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-8 h-8"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-6">
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
            className="px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
} 