"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useToast } from "@/contexts/ToastContext";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { Instagram, Youtube, SquareX, Music, Github, Twitch, ChevronDown } from "lucide-react";

interface SocialLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platformOptions = [
  { value: "instagram", label: "Instagram", icon: <Instagram size={20} /> },
  { value: "youtube", label: "YouTube", icon: <Youtube size={20} /> },
  { value: "twitter", label: "Twitter", icon: <SquareX size={20} /> },
  { value: "spotify", label: "Spotify", icon: <Music size={20} /> },
  { value: "github", label: "GitHub", icon: <Github size={20} /> },
  { value: "twitch", label: "Twitch", icon: <Twitch size={20} /> },
];

const SocialLinksModal: React.FC<SocialLinksModalProps> = ({ isOpen, onClose }) => {
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

  const handleSave = () => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Social Links">
      <div className="space-y-6">
        {/* Display existing links */}
        {savedLinks.map((link, index) => (
          <div key={index} className="flex space-x-3">
            {/* Platform display (already saved) */}
            <div className="w-1/2">
              <div className="flex items-center gap-2 px-3 py-2.5 text-base border rounded-md bg-[#151C2A] border-[#1E293B] text-gray-300">
                {getPlatformIcon(link.platform)}
                <span>{getPlatformLabel(link.platform)}</span>
              </div>
            </div>
            
            {/* URL display with delete button */}
            <div className="w-1/2 relative flex">
              <input
                type="text"
                value={link.url}
                readOnly
                className="w-full px-3 py-2.5 text-base bg-[#151C2A] border border-[#1E293B] rounded-l-md text-[#81E4F2]"
              />
              <button
                onClick={() => handleRemoveLink(index)}
                className="bg-[#151C2A] text-gray-400 hover:text-red-400 px-3 py-2.5 border border-l-0 border-[#1E293B] rounded-r-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {/* Input for new link */}
        <div className="flex space-x-3">
          {/* Platform dropdown */}
          <div className="w-1/2 relative">
            <button
              type="button"
              className="flex items-center justify-between w-full px-3 py-2.5 text-base border rounded-md bg-[#151C2A] border-[#1E293B] text-gray-300"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex items-center gap-2">
                {platform ? getPlatformIcon(platform) : null}
                <span>{platform ? getPlatformLabel(platform) : "Select Platform"}</span>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-[#151C2A] border border-[#1E293B] rounded-md shadow-lg">
                <ul className="py-1 max-h-48 overflow-auto">
                  {platformOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={`flex items-center w-full px-3 py-2 text-sm hover:bg-[#1a2436] ${
                          platform === option.value ? "bg-[#1a2436] text-[#81E4F2]" : "text-gray-300"
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
          
          {/* URL input with Add button */}
          <div className="w-1/2 flex">
            <input
              type="text"
              placeholder="https://"
              value={url}
              onChange={handleUrlChange}
              className="w-full px-3 py-2.5 text-base bg-[#151C2A] border border-[#1E293B] rounded-md text-gray-300 placeholder-gray-500"
            />
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="pt-4 border-t border-[#1E293B] flex justify-end gap-3">
          <Button 
            onClick={() => {
              // Explicitly set to just one empty field
              setSavedLinks([]);
            }}
            size="lg"
            variant="secondary"
          >
            Clear All Links
          </Button>
          <Button size="lg" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="lg" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SocialLinksModal; 