"use client";

import React from "react";
import Modal from "../ui/Modal";
import { useProfile } from "@/contexts/ProfileContext";
import ImageUploader from "../shared/ImageUploader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  
  const variantClasses = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

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
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
} 