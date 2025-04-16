"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    maxFiles: 1
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
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setImageUrl("");
              onImageChange("");
            }}
            className="absolute top-2 right-2 p-1 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80"
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
              className="text-white"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
      
      {/* Upload tab content */}
      {activeTab === "upload" && !preview && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-cyan-400 bg-slate-800"
              : "border-slate-700 hover:border-slate-600"
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
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
                className="text-cyan-400"
              >
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <line x1="16" y1="5" x2="22" y2="5"></line>
                <line x1="19" y1="2" x2="19" y2="8"></line>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            </div>
            <p className="text-sm text-gray-400">
              {isDragActive
                ? "Drop the image here"
                : "Drag and drop an image here, or click to select"}
            </p>
            <p className="text-xs text-gray-500">
              Supports JPG, PNG, GIF up to 5MB
            </p>
          </div>
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