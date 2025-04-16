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
      onClose={onClose}
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
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
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
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
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
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
          >
            {item ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </form>
    </Modal>
  );
} 