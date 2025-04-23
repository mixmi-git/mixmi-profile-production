"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset preview when initialImage changes
  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
      setImageUrl(initialImage);
    } else {
      // Reset when initialImage is empty or null (for new items)
      setPreview(null);
      setImageUrl("");
    }
  }, [initialImage]);
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    console.log("File drop detected:", acceptedFiles.length ? acceptedFiles[0].name : "No files");
    
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
      console.log("File successfully processed:", file.name);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
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
    noClick: false,
    noKeyboard: false
  });
  
  // Handle manual click to open file dialog
  const handleClickToUpload = (e: React.MouseEvent) => {
    // Don't open file dialog if clicked on the Browse Files button
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      e.stopPropagation(); // Stop event here to prevent dropzone handlers from interfering
      return; // Let the button's own click handler handle it
    }
    
    // For other elements in the upload area, open the file dialog
    open();
    console.log("Opened file dialog via click");
  };
  
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
        if (fileInputRef.current) {
          fileInputRef.current.click();
        } else {
          open(); // Fallback to useDropzone's open method
        }
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
              ? "border-b-2 border-[#81E4F2] text-[#81E4F2]"
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
              ? "border-b-2 border-[#81E4F2] text-[#81E4F2]"
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
              className="text-white text-sm flex items-center hover:text-[#81E4F2] transition-colors"
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
          className="upload-area border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-[#81E4F2] transition-colors"
          onClick={handleClickToUpload}
        >
          <input {...getInputProps()} ref={fileInputRef} />
          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-400">Click to upload or drag and drop</p>
          <p className="text-gray-500 text-sm mt-1">PNG, JPG or GIF (max 5MB)</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (fileInputRef.current) {
                fileInputRef.current.click();
              } else {
                open(); // Fallback to useDropzone's open method
              }
            }}
            className="mt-4 px-4 py-2 bg-slate-800 text-gray-300 rounded-md hover:bg-slate-700 transition-colors"
          >
            Browse Files
          </button>
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
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81E4F2]"
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