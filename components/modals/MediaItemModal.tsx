"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { MediaItem } from "@/types";
import { parseMediaUrl, getMediaPreview, MediaType } from "@/lib/mediaUtils";
import { v4 as uuidv4 } from "uuid";

interface MediaItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: MediaItem;
  onSave: (item: MediaItem) => void;
}

export default function MediaItemModal({
  isOpen,
  onClose,
  item,
  onSave,
}: MediaItemModalProps) {
  const [formData, setFormData] = useState<MediaItem>({
    id: "",
    type: "youtube",
    title: "",
    rawUrl: "",
    embedUrl: ""
  });
  
  const [preview, setPreview] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset form data when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({ ...item });
        if (item.embedUrl) {
          setPreview(getMediaPreview(item.type as MediaType, item.embedUrl));
        }
      } else {
        setFormData({
          id: uuidv4(),
          type: "youtube",
          title: "",
          rawUrl: "",
          embedUrl: ""
        });
        setPreview(null);
      }
      setError(null);
    }
  }, [isOpen, item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, rawUrl: url }));
    
    // Clear previous embed data to ensure it gets regenerated
    setFormData((prev) => ({ 
      ...prev, 
      rawUrl: url,
      embedUrl: "", // Clear the embed URL to force regeneration
      type: "youtube" // Reset type to default
    }));
    
    setError(null);
    setPreview(null);
  };
  
  const generatePreview = () => {
    const url = formData.rawUrl.trim();
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    
    const mediaInfo = parseMediaUrl(url);
    if (!mediaInfo) {
      setError("Unable to parse media URL");
      return;
    }
    
    // Always update the media type and embed URL based on the raw URL
    setFormData((prev) => ({
      ...prev,
      type: mediaInfo.type,
      embedUrl: mediaInfo.embedUrl,
      title: prev.title || mediaInfo.title || ""
    }));
    
    setPreview(getMediaPreview(mediaInfo.type, mediaInfo.embedUrl));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.rawUrl.trim()) {
      setError("URL is required");
      return;
    }
    
    // Always regenerate the embed URL before saving
    if (!formData.embedUrl) {
      generatePreview();
      
      // Need to delay the save to allow the state to update
      setTimeout(() => {
        if (formData.embedUrl) {
          onSave(formData);
          onClose();
        }
      }, 100);
      return;
    }
    
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? "Edit Media Item" : "Add Media Item"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for this media"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label
            htmlFor="rawUrl"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Media URL*
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="rawUrl"
              name="rawUrl"
              value={formData.rawUrl}
              onChange={handleUrlChange}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <button
              type="button"
              onClick={generatePreview}
              className="px-3 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600"
            >
              Preview
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Supports YouTube, Spotify, SoundCloud, Mixcloud, Apple Music, and more
          </p>
        </div>

        {/* Preview area */}
        {preview && (
          <div className="border border-slate-700 rounded-md overflow-hidden">
            <div className="p-2 bg-slate-800">
              <h3 className="text-sm font-medium">Preview ({formData.type})</h3>
            </div>
            <div className="p-4 bg-slate-900">
              {preview}
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

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