"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useToast } from "@/contexts/ToastContext";
import Modal from "../ui/Modal";
import { 
  Instagram, 
  Youtube, 
  Music, 
  Github, 
  Twitch, 
  ChevronDown
} from "lucide-react";
import { 
  FaSoundcloud, 
  FaMixcloud,
  FaTiktok,
  FaXTwitter
} from "react-icons/fa6";

interface SocialLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platformOptions = [
  { value: "instagram", label: "Instagram", icon: <Instagram size={20} /> },
  { value: "youtube", label: "YouTube", icon: <Youtube size={20} /> },
  { value: "twitter", label: "X", icon: <FaXTwitter size={20} /> },
  { value: "soundcloud", label: "SoundCloud", icon: <FaSoundcloud size={20} /> },
  { value: "mixcloud", label: "Mixcloud", icon: <FaMixcloud size={20} /> },
  { value: "tiktok", label: "TikTok", icon: <FaTiktok size={20} /> },
  { value: "spotify", label: "Spotify", icon: <Music size={20} /> },
  { value: "github", label: "GitHub", icon: <Github size={20} /> },
  { value: "twitch", label: "Twitch", icon: <Twitch size={20} /> },
];

export default function SocialLinksModal({ isOpen, onClose }: SocialLinksModalProps) {
  const { profile, updateProfile } = useProfile();
  const { showToast } = useToast();
  
  // Track current input for new link
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Track existing saved links
  const [savedLinks, setSavedLinks] = useState<{platform: string, url: string}[]>([]);
  
  // Reset the form and load current links when opened
  useEffect(() => {
    if (isOpen && profile) {
      // Clear inputs
      setPlatform("");
      setUrl("");
      
      // Load existing links (filter out any incomplete ones)
      if (profile.socialLinks && Array.isArray(profile.socialLinks)) {
        setSavedLinks(
          profile.socialLinks
            .filter(link => link && link.platform && link.url)
            .map(link => ({ platform: link.platform, url: link.url }))
        );
      } else {
        setSavedLinks([]);
      }
    }
  }, [isOpen, profile]);

  const handlePlatformSelect = (selectedPlatform: string) => {
    setPlatform(selectedPlatform);
    setDropdownOpen(false);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  
  const handleAddLink = () => {
    if (!platform || !url) {
      showToast("Please select a platform and enter a valid URL", "error");
      return;
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      showToast("Please enter a valid URL starting with http:// or https://", "error");
      return;
    }
    
    // Add the new link
    setSavedLinks([...savedLinks, { platform, url }]);
    
    // Clear inputs for next link
    setPlatform("");
    setUrl("");
  };
  
  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...savedLinks];
    updatedLinks.splice(index, 1);
    setSavedLinks(updatedLinks);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there's an unsaved link in the input fields
    const allLinks = [...savedLinks];
    if (platform && url) {
      try {
        new URL(url);
        allLinks.push({ platform, url });
      } catch {
        showToast("Please enter a valid URL starting with http:// or https://", "error");
        return;
      }
    }
    
    updateProfile({ ...profile, socialLinks: allLinks });
    showToast("Social links updated", "success");
    onClose();
  };

  const getPlatformIcon = (platformValue: string) => {
    const option = platformOptions.find(opt => opt.value === platformValue);
    return option ? option.icon : null;
  };

  const getPlatformLabel = (platformValue: string) => {
    const option = platformOptions.find(opt => opt.value === platformValue);
    return option ? option.label : "Select Platform";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Social Links">
      <form onSubmit={handleSave} className="space-y-4">
        {/* Display existing links */}
        {savedLinks.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Your Links
            </label>
            {savedLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex items-center px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md text-gray-300 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-8 flex-shrink-0">
                    {getPlatformIcon(link.platform)}
                  </div>
                  <span className="mx-2 text-gray-500">|</span>
                  <span className="text-gray-300 truncate flex-1 overflow-hidden">{link.url}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 flex-shrink-0"
                  title="Remove link"
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
                    className="text-red-400"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Input for new link */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Add New Link
          </label>
          <div className="flex space-x-2">
            {/* Platform dropdown */}
            <div className="relative w-[100px] shrink-0">
              <button
                type="button"
                className="flex items-center justify-between w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#81E4F2]"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={platform ? getPlatformLabel(platform) : "Select Platform"}
              >
                <div className="flex items-center justify-center">
                  {platform ? getPlatformIcon(platform) : "Platform"}
                </div>
                <ChevronDown size={16} className="text-gray-500 ml-1 shrink-0" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute z-10 w-[200px] mt-1 bg-[#0f172a] border border-[#1e293b] rounded-md shadow-lg">
                  <ul className="py-1 max-h-48 overflow-auto">
                    {platformOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          type="button"
                          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-[#1e293b] ${
                            platform === option.value ? "bg-[#1e293b] text-[#81E4F2]" : "text-gray-300"
                          }`}
                          onClick={() => handlePlatformSelect(option.value)}
                        >
                          <div className="flex items-center gap-2">
                            {option.icon}
                            <span>{option.label}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* URL input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="https://"
                value={url}
                onChange={handleUrlChange}
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#81E4F2]"
              />
            </div>
          </div>
          
          {/* Add button as large plus icon */}
          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={handleAddLink}
              className="flex items-center justify-center p-3 text-gray-500 hover:text-gray-400 transition-colors"
              aria-label="Add new link"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-8 h-8"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-4">
          {savedLinks.length > 0 && (
            <button
              type="button"
              onClick={() => setSavedLinks([])}
              className="px-4 py-2 border border-[#1e293b] rounded-md text-gray-300 hover:bg-[#1e293b]"
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#1e293b] rounded-md text-gray-300 hover:bg-[#1e293b]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
} 