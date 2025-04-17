"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useProfile } from "@/contexts/ProfileContext";
import { ProfileData, SocialLink } from "@/types";
import { X } from "lucide-react";

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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Limited to only the platforms we want
const PLATFORM_OPTIONS = [
  { value: "twitter", label: "X" },
  { value: "instagram", label: "Instagram" },
  { value: "github", label: "GitHub" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "soundcloud", label: "SoundCloud" }
];

// Character limits for fields
const CHARACTER_LIMITS = {
  name: 40,
  title: 40,
  bio: 350
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState<ProfileData>({
    ...profile,
    // We're managing wallet visibility in a separate modal now
    showWalletAddress: profile.showWalletAddress,
    showBtcAddress: profile.showBtcAddress
  });

  useEffect(() => {
    // Reset form data when modal opens
    if (isOpen) {
      setFormData({
        ...profile,
        // We're managing wallet visibility in a separate modal now
        showWalletAddress: profile.showWalletAddress,
        showBtcAddress: profile.showBtcAddress
      });
    }
  }, [isOpen, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Apply character limits if needed
    if (CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS]) {
      const limit = CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS];
      if (value.length <= limit) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle social link changes
  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
  };
  
  // Add a new social link
  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'twitter', url: '' }]
    }));
  };
  
  // Remove a social link
  const removeSocialLink = (index: number) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks.splice(index, 1);
    setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Preserve existing wallet visibility settings
    const updatedProfile = {
      ...formData,
      showWalletAddress: profile.showWalletAddress,
      showBtcAddress: profile.showBtcAddress
    };
    updateProfile(updatedProfile);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Name
            </label>
            <span className="text-sm text-slate-400">
              {(formData.name?.length || 0)}/{CHARACTER_LIMITS.name}
            </span>
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
            maxLength={CHARACTER_LIMITS.name}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300">
              Title
            </label>
            <span className="text-sm text-slate-400">
              {(formData.title?.length || 0)}/{CHARACTER_LIMITS.title}
            </span>
          </div>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
            maxLength={CHARACTER_LIMITS.title}
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-slate-300 mb-1">
            Profile Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="bio" className="block text-sm font-medium text-slate-300">
              Bio
            </label>
            <span className="text-sm text-slate-400">
              {(formData.bio?.length || 0)}/{CHARACTER_LIMITS.bio}
            </span>
          </div>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
            maxLength={CHARACTER_LIMITS.bio}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-300">Social Links</p>
            <button
              type="button"
              onClick={addSocialLink}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              + Add Link
            </button>
          </div>
          
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="flex items-start space-x-2">
              <select
                value={link.platform}
                onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {PLATFORM_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              />
              
              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="text-gray-400 hover:text-gray-300 px-2 py-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal; 