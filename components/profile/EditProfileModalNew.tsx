"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useProfile } from "@/contexts/ProfileContext";
import { ProfileData, SocialLink } from "@/types";

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

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState<ProfileData>({...profile});

  useEffect(() => {
    // Reset form data when modal opens
    if (isOpen) {
      setFormData({...profile});
    }
  }, [isOpen, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    updateProfile(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
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
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
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
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Wallet Address Visibility */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-300">Wallet Address Settings</p>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showWalletAddress"
              name="showWalletAddress"
              checked={formData.showWalletAddress}
              onChange={handleCheckboxChange}
              className="h-4 w-4 bg-slate-800 border-slate-700 rounded text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="showWalletAddress" className="ml-2 block text-sm text-slate-300">
              Show STX wallet address
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showBtcAddress"
              name="showBtcAddress"
              checked={formData.showBtcAddress}
              onChange={handleCheckboxChange}
              className="h-4 w-4 bg-slate-800 border-slate-700 rounded text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="showBtcAddress" className="ml-2 block text-sm text-slate-300">
              Show BTC wallet address
            </label>
          </div>
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