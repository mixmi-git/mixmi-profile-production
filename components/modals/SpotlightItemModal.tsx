"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import ImageUploader from "../shared/ImageUploader";
import { SpotlightItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface SpotlightItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: SpotlightItem; // Existing item when editing, undefined when adding new
  onSave: (item: SpotlightItem) => void;
}

export default function SpotlightItemModal({
  isOpen,
  onClose,
  item,
  onSave,
}: SpotlightItemModalProps) {
  const [formData, setFormData] = useState<SpotlightItem>({
    id: uuidv4(),
    title: "",
    description: "",
    image: "",
    link: "",
  });

  // Reset form data when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      try {
        if (item) {
          // Editing existing item
          console.log("Editing existing item:", item);
          setFormData({ ...item });
        } else {
          // Adding new item with a fresh ID
          console.log("Creating new item");
          const newItem = {
            id: uuidv4(),
            title: "",
            description: "",
            image: "",
            link: "",
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
      title: "",
      description: "",
      image: "",
      link: "",
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      const { name, value } = e.target;
      console.log(`Updating ${name} field with value:`, value);
      console.log("Current formData:", formData);
      
      // Safely update state
      setFormData((prev) => {
        const newState = { ...prev, [name]: value };
        console.log("New formData will be:", newState);
        return newState;
      });
    } catch (error) {
      console.error("Error in handleChange:", error);
    }
  };

  const handleImageChange = (imageData: string) => {
    try {
      console.log("Updating image data, length:", imageData?.length || 0);
      
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
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }
    
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
      title={item ? "Edit Spotlight Item" : "Add Spotlight Item"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81E4F2]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows={3}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81E4F2] resize-none"
          />
        </div>

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

        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Link URL
          </label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81E4F2]"
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