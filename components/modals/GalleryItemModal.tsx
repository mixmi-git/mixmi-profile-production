"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import ImageUploader from "../shared/ImageUploader";
import { GalleryItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface GalleryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: GalleryItem; // Existing item when editing, undefined when adding new
  onSave: (item: GalleryItem) => void;
}

export default function GalleryItemModal({
  isOpen,
  onClose,
  item,
  onSave,
}: GalleryItemModalProps) {
  const [formData, setFormData] = useState<GalleryItem>({
    id: uuidv4(),
    image: "",
    createdAt: new Date().toISOString()
  });

  // Reset form data when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      try {
        if (item) {
          // Editing existing item
          console.log("Editing existing gallery item:", item);
          setFormData({ ...item });
        } else {
          // Adding new item
          console.log("Creating new gallery item");
          const newItem = {
            id: uuidv4(),
            image: "",
            createdAt: new Date().toISOString()
          };
          setFormData(newItem);
        }
      } catch (error) {
        console.error("Error resetting form data:", error);
      }
    }
  }, [isOpen, item]);

  // Function to handle modal close with clean state
  const handleModalClose = () => {
    // Clean up by explicitly clearing form data 
    // to avoid stale state on next open
    setFormData({
      id: uuidv4(),
      image: "",
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  const handleImageChange = (imageData: string) => {
    try {
      console.log("Updating gallery image, length:", imageData?.length || 0);
      
      // Safely update state
      setFormData((prev) => {
        const newState = { ...prev, image: imageData };
        return newState;
      });
    } catch (error) {
      console.error("Error in handleImageChange:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required field
    if (!formData.image) {
      alert("Image is required");
      return;
    }
    
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={item ? "Edit Gallery Item" : "Add Gallery Item"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Image*
          </label>
          <ImageUploader
            initialImage={formData.image}
            onImageChange={handleImageChange}
            aspectRatio="square"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={handleModalClose}
            className="px-4 py-2 border border-slate-700 rounded-md text-gray-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7]"
          >
            {item ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </form>
    </Modal>
  );
} 