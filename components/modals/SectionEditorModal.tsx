"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useDrag, useDrop } from "react-dnd";
import Image from "next/image";

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
            {item.type === 'youtube' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FF0000" strokeWidth="0">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            )}
            {item.type === 'spotify' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" strokeWidth="0">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            )}
            {item.type === 'soundcloud' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <rect width="24" height="24" fill="#FF7700" rx="4"/>
                <path d="M7 17h12v-6c0 0-2-3-6-3s-6 3-6 3v6z" fill="white"/>
              </svg>
            )}
            {item.type === 'apple-music' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FA243C" strokeWidth="0">
                <path d="M23.994 6.124c-.038-2.86-1.578-5.233-3.969-6.009-1.368-.447-3.2-.623-4.731-.682-4.13-.156-8.5-.156-12.688.005-2.381.051-5.282.537-6.601 2.118-1.397 1.673-1.368 4.545-1.376 6.962 0 2.436-.034 4.895.081 7.319.045 1.17.303 2.322.702 3.393.489 1.31 1.258 2.482 2.34 3.325 1.093.849 2.412 1.32 3.767 1.41 1.407.094 2.964.142 4.371.142 2.667 0 5.337 0 8.003-.035 2-.032 4.022-.095 5.992-.242 1.159-.086 2.298-.326 3.347-.778 1.892-.818 3.183-2.615 3.631-4.581.159-.705.242-1.424.289-2.145.171-2.457.163-4.926.162-7.382 0-1.792.034-3.592-.137-5.382zm-19.468 7.928c1.235-.09 2.34-.683 3.106-1.414.169-.165.33-.339.475-.521.26-.329.475-.671.639-1.021.287-.614.396-1.283.395-1.937-.007-1.256-.596-2.478-1.666-3.234-.526-.374-1.154-.614-1.792-.669-.301-.026-.603-.026-.901.001-1.304.059-2.565.595-3.526 1.334-1.596 1.227-2.199 3.11-1.704 4.869.361 1.282 1.301 2.368 2.595 2.845.517.192 1.062.268 1.618.268.253 0 .508-.016.761-.051zm8.819-10.46c-.545-.537-1.233-.892-1.962-1.052-.371-.081-.751-.118-1.136-.117-.737.002-1.462.156-2.105.454-.952.444-1.69 1.137-2.152 1.978-.898 1.625-.712 3.609.49 5.049.253.299.54.566.85.797.54.403 1.158.692 1.821.826.412.083.84.124 1.265.125 1.208.003 2.32-.327 3.132-1.078.898-.833 1.39-1.996 1.401-3.174.012-1.257-.433-2.553-1.604-3.807zm6.774 10.405c-.093.867-.329 1.72-.879 2.527-.493.722-1.152 1.34-1.933 1.835-.409.258-.843.479-1.296.648-1.025.384-2.094.414-3.169.414-1.146 0-2.285-.101-3.43-.101-1.996 0-3.993 0-5.989.101-.975.047-1.951.095-2.926.143-.723.035-1.472.051-2.171-.052-.825-.121-1.592-.455-2.266-.895-.703-.458-1.331-1.023-1.843-1.651-.549-.671-.947-1.403-1.175-2.154-.126-.414-.201-.837-.255-1.265-.112-.888-.148-1.782-.165-2.672-.049-2.547-.049-5.093-.049-7.639.013-1.333.06-2.696.254-4.016.152-1.026.516-2.017 1.177-2.89.651-.861 1.513-1.567 2.475-2.071.967-.505 2.019-.761 3.104-.776 2.47-.033 4.944-.033 7.414-.033 2.393 0 4.779 0 7.171.025 1.086.009 2.191.06 3.234.331.758.197 1.474.512 2.107.964.672.479 1.226 1.079 1.685 1.734.499.713.87 1.493 1.095 2.32.142.524.225 1.057.278 1.598.149 1.518.141 3.049.141 4.568-.01 1.924.01 3.839-.091 5.751z"/>
              </svg>
            )}
            {item.type === 'mixcloud' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5000FF" strokeWidth="0">
                <path d="M21.95 19.062c0 .375-.062.656-.174.843-.113.195-.383.344-.813.438l-.491.125c-.465.094-.992.172-1.582.219-1.465.125-3.121.211-4.966.211-1.914 0-3.633-.094-5.102-.219-1.484-.156-2.531-.375-3.121-.688-.375-.156-.585-.391-.671-.719-.023-.023-.035-.062-.035-.105v-2.5c.082-.375.198-.719.326-1.023.14-.305.351-.578.632-.774l.491-.297c.195-.164.41-.297.632-.438.633.586 1.379 1.102 2.219 1.485.878.375 1.844.578 2.898.602 1.055-.023 2.02-.226 2.898-.602.844-.383 1.582-.898 2.22-1.484.59.374 1.14.797 1.558 1.296.421.485.771 1.046 1.019 1.671v.875m-3.387-7.492c-.082-.609-.291-1.172-.632-1.687-.336-.523-.781-.969-1.344-1.313-.547-.359-1.152-.648-1.816-.843-.656-.211-1.324-.32-2.001-.32-.691 0-1.344.109-2.001.32-.656.195-1.254.484-1.816.843-.547.344-.997.791-1.332 1.313-.347.516-.551 1.078-.633 1.687-.023.109-.035.234-.035.375 0 .125.012.25.035.359.082.609.285 1.164.633 1.688.336.523.785.969 1.332 1.297.562.359 1.16.648 1.816.859.656.195 1.309.305 2.001.305.676 0 1.344-.109 2.001-.305.664-.211 1.269-.5 1.816-.859.563-.328 1.008-.773 1.344-1.297.34-.524.549-1.079.632-1.688.023-.109.035-.234.035-.359 0-.14-.012-.266-.035-.375m5.137-2.836c-.293-.75-.676-1.469-1.137-2.156-.457-.68-.984-1.344-1.57-1.968-.598-.633-1.211-1.213-1.848-1.75-.633-.539-1.285-1.031-1.934-1.469-.655-.453-1.308-.812-1.973-1.109-.664-.297-1.309-.504-1.941-.641-.625-.125-1.219-.188-1.781-.188-.578 0-1.133.063-1.656.188-.75.188-1.465.457-2.152.832-.684.363-1.332.793-1.957 1.297-.614.492-1.203 1.031-1.731 1.617-.543.586-1.027 1.203-1.45 1.843-.434.652-.774 1.317-1.047 2-.269.672-.465 1.347-.574 2.016-.117.664-.176 1.297-.176 1.906 0 .625.059 1.219.176 1.781.108.563.305 1.126.574 1.688.129.273.281.547.445.805.172.258.34.504.527.719.188.234.387.457.598.672.21.219.422.406.645.578.222.188.457.363.691.531.246.164.48.312.715.449.48.297.996.543 1.535.738.55.203 1.133.363 1.746.469.621.117 1.269.176 1.957.176.68 0 1.316-.059 1.895-.176.59-.105 1.16-.254 1.692-.445.531-.188 1.039-.422 1.523-.703.496-.285.949-.586 1.367-.914 1.336-.219 2.568-.598 3.691-1.126 1.125-.539 2.168-1.203 3.133-2 .965-.805 1.785-1.715 2.465-2.734.684-1.024 1.208-2.129 1.582-3.328.375-1.196.563-2.426.563-3.688-.001-.601-.055-1.208-.173-1.829"/>
              </svg>
            )}
            {(!item.type || item.type === 'other') && (
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
            )}
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
      <div className="space-y-8">
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