"use client";

import React from "react";
import Modal from "../ui/Modal";
import { useProfile } from "@/contexts/ProfileContext";
import ImageUploader from "../shared/ImageUploader";
import { Button } from "../ui/Button";

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
}

export default function ProfileImageModal({ isOpen, onClose, currentImage }: ProfileImageModalProps) {
  const { updateProfile } = useProfile();
  
  const handleImageChange = (imageData: string) => {
    updateProfile({
      image: imageData
    });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile Image">
      <div className="space-y-6">
        <p className="text-sm text-gray-400">
          Choose an image for your profile. You can upload an image file or provide a URL.
        </p>
        
        <ImageUploader
          initialImage={currentImage}
          onImageChange={handleImageChange}
          aspectRatio="square"
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
} 