"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import ImageUploader from "../shared/ImageUploader";
import { ShopItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface ShopItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ShopItem; // Existing item when editing, undefined when adding new
  onSave: (item: ShopItem) => void;
}

export default function ShopItemModal({
  isOpen,
  onClose,
  item,
  onSave,
}: ShopItemModalProps) {
  const [formData, setFormData] = useState<ShopItem>({
    id: "",
    title: "",
    description: "",
    image: "",
    link: "",
  });

  // Reset form data when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        // Editing existing item
        setFormData({ ...item });
      } else {
        // Adding new item
        setFormData({
          id: uuidv4(),
          title: "",
          description: "",
          image: "",
          link: "",
        });
      }
    }
  }, [isOpen, item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (imageData: string) => {
    setFormData((prev) => ({ ...prev, image: imageData }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert("Item name is required");
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
      onClose={onClose}
      title={item ? "Edit Shop Item" : "Add Shop Item"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Item Name*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter item name"
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
            placeholder="Brief description of what you're offering"
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
            Purchase Link
          </label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="URL where this item can be purchased"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81E4F2]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the URL where customers can purchase this item
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
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