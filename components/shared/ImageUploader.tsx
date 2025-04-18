"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2, Upload } from "lucide-react";

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (imageData: string) => void;
  aspectRatio?: "square" | "video" | "free";
}

export default function ImageUploader({
  initialImage,
  onImageChange,
  aspectRatio = "square"
}: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState(initialImage || "");
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);
  
  // Reset preview when initialImage changes
  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
      setImageUrl(initialImage);
    }
  }, [initialImage]);
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }
    
    // Convert file to base64 string for localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageChange(base64String);
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    maxFiles: 1,
    noClick: false, // Ensure clicks are captured
    noKeyboard: false // Allow keyboard navigation
  });
  
  // Handle URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreview(url.length > 0 ? url : null);
    onImageChange(url);
  };
  
  // Handle URL validation
  const validateUrl = () => {
    try {
      new URL(imageUrl);
      setError(null);
    } catch (err) {
      setError("Please enter a valid URL");
    }
  };

  // Handle clearing the image
  const handleClearImage = () => {
    setPreview(null);
    setImageUrl("");
    onImageChange("");
    
    // If we're not on the upload tab, switch to it
    if (activeTab !== "upload") {
      setActiveTab("upload");
    }
    
    // Small delay to ensure the UI updates before attempting to open the file dialog
    setTimeout(() => {
      if (activeTab === "upload") {
        open(); // This will open the file dialog directly
      }
    }, 100);
  };
  
  // Calculate aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "free":
      default:
        return "";
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Tab navigation */}
      <div className="flex border-b border-slate-700">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "upload"
              ? "border-b-2 border-cyan-400 text-cyan-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("upload")}
        >
          Upload Image
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "url"
              ? "border-b-2 border-cyan-400 text-cyan-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("url")}
        >
          Image URL
        </button>
      </div>
      
      {/* Image preview */}
      {preview && (
        <div className={`relative overflow-hidden bg-slate-800 ${getAspectRatioClass()}`}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3 flex justify-center">
            <button 
              onClick={handleClearImage}
              className="text-white text-sm flex items-center hover:text-cyan-400 transition-colors"
            >
              <Trash2 size={16} className="mr-1" />
              Replace Image
            </button>
          </div>
        </div>
      )}
      
      {/* Upload tab content */}
      {activeTab === "upload" && !preview && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400 transition-colors"
        >
          <input {...getInputProps()} />
          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-400">Click to upload or drag and drop</p>
          <p className="text-gray-500 text-sm mt-1">PNG, JPG or GIF (max 5MB)</p>
        </div>
      )}
      
      {/* URL tab content */}
      {activeTab === "url" && !preview && (
        <div className="space-y-2">
          <input
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            onBlur={validateUrl}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p className="text-xs text-gray-500">
            Enter the URL of an image from the web
          </p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
} 