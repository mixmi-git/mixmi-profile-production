"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { ProfileData, SocialLink } from "@/types";
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

interface UnifiedProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Character limits for fields
const CHARACTER_LIMITS = {
  name: 40,
  title: 40,
  bio: 350
};

// Social platform options
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

// Tabs for the modal
type TabType = "profile" | "social" | "wallet";

export default function UnifiedProfileModal({ isOpen, onClose }: UnifiedProfileModalProps) {
  const { profile, updateProfile } = useProfile();
  const { walletAddress, btcAddress } = useAuth();
  const { showToast } = useToast();
  
  // State for tab selection
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  
  // Profile form state
  const [profileData, setProfileData] = useState<ProfileData>({
    ...profile
  });
  
  // Social links state
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
  // Wallet state
  const [showStx, setShowStx] = useState(profile.showWalletAddress);
  const [showBtc, setShowBtc] = useState(profile.showBtcAddress);
  
  // Reset all form data when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset active tab
      setActiveTab("profile");
      
      // Reset profile data
      setProfileData({
        ...profile,
      });
      
      // Reset social links
      setPlatform("");
      setUrl("");
      if (profile.socialLinks && Array.isArray(profile.socialLinks)) {
        setSocialLinks(
          profile.socialLinks
            .filter(link => link && link.platform && link.url)
            .map(link => ({ platform: link.platform, url: link.url }))
        );
      } else {
        setSocialLinks([]);
      }
      
      // Reset wallet settings
      setShowStx(profile.showWalletAddress);
      setShowBtc(profile.showBtcAddress);
    }
  }, [isOpen, profile]);
  
  // Tab handling
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  // Profile tab handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Apply character limits if needed
    if (CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS]) {
      const limit = CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS];
      if (value.length <= limit) {
        setProfileData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Social tab handlers
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
    setSocialLinks([...socialLinks, { platform, url }]);
    
    // Clear inputs for next link
    setPlatform("");
    setUrl("");
  };
  
  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
  };
  
  const getPlatformIcon = (platformValue: string) => {
    const option = platformOptions.find(opt => opt.value === platformValue);
    return option ? option.icon : null;
  };

  const getPlatformLabel = (platformValue: string) => {
    const option = platformOptions.find(opt => opt.value === platformValue);
    return option ? option.label : "Select Platform";
  };
  
  // Save all changes
  const handleSave = () => {
    // Check if there's an unsaved link in the input fields
    let finalSocialLinks = [...socialLinks];
    if (platform && url) {
      try {
        new URL(url);
        finalSocialLinks.push({ platform, url });
      } catch {
        // If we're in the social tab, show error and return
        if (activeTab === "social") {
          showToast("Please enter a valid URL starting with http:// or https://", "error");
          return;
        }
        // Otherwise just ignore the invalid link
      }
    }
    
    // Update the profile with all the changes
    updateProfile({
      ...profileData,
      socialLinks: finalSocialLinks,
      showWalletAddress: showStx,
      showBtcAddress: showBtc
    });
    
    showToast("Profile updated successfully", "success");
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      {/* Tab navigation */}
      <div className="flex border-b border-slate-700 mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "profile" 
              ? "text-accent border-b-2 border-accent" 
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => handleTabChange("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "social" 
              ? "text-accent border-b-2 border-accent" 
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => handleTabChange("social")}
        >
          Social Links
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "wallet" 
              ? "text-accent border-b-2 border-accent" 
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => handleTabChange("wallet")}
        >
          Wallet
        </button>
      </div>
      
      {/* Profile tab content */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Name
              </label>
              <span className="text-sm text-slate-400">
                {(profileData.name?.length || 0)}/{CHARACTER_LIMITS.name}
              </span>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name || ''}
              onChange={handleProfileChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              maxLength={CHARACTER_LIMITS.name}
              placeholder="Choose any display name - change it any time"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">
                What You Do
              </label>
              <span className="text-sm text-slate-400">
                {(profileData.title?.length || 0)}/{CHARACTER_LIMITS.title}
              </span>
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={profileData.title || ''}
              onChange={handleProfileChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              maxLength={CHARACTER_LIMITS.title}
              placeholder="A short description of who you are or what you do"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="bio" className="block text-sm font-medium text-slate-300">
                Bio
              </label>
              <span className="text-sm text-slate-400">
                {(profileData.bio?.length || 0)}/{CHARACTER_LIMITS.bio}
              </span>
            </div>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio || ''}
              onChange={handleProfileChange}
              rows={3}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              maxLength={CHARACTER_LIMITS.bio}
              placeholder="Share a bit about yourself, your work, interests, or anything you'd like others to know"
            />
          </div>
        </div>
      )}
      
      {/* Social links tab content */}
      {activeTab === "social" && (
        <div className="space-y-4">
          {/* Display existing links */}
          {socialLinks.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Your Links
              </label>
              {socialLinks.map((link, index) => (
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
          
          {/* Clear all button */}
          {socialLinks.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSocialLinks([])}
                className="px-4 py-2 border border-[#1e293b] rounded-md text-gray-300 hover:bg-[#1e293b]"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Wallet tab content */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          {/* Current wallet addresses */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">Connected Wallets</h3>
            
            {walletAddress ? (
              <div className="bg-slate-900 p-2 rounded-md flex items-center">
                <span className="text-xs text-gray-500">STX:</span>
                <span className="ml-2 text-sm">{`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No STX wallet connected</p>
            )}
            
            {btcAddress ? (
              <div className="bg-slate-900 p-2 rounded-md flex items-center">
                <span className="text-xs text-gray-500">BTC:</span>
                <span className="ml-2 text-sm">{`${btcAddress.slice(0, 8)}...${btcAddress.slice(-8)}`}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No BTC wallet connected</p>
            )}
          </div>

          {/* Visibility settings */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">Visibility Settings</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showStx"
                checked={showStx}
                onChange={(e) => setShowStx(e.target.checked)}
                className="h-4 w-4 bg-slate-800 border-slate-700 rounded text-[#81E4F2] focus:ring-[#81E4F2]"
                disabled={!walletAddress}
              />
              <label htmlFor="showStx" className="ml-2 text-sm text-slate-300">
                Show STX wallet address on profile
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showBtc"
                checked={showBtc}
                onChange={(e) => setShowBtc(e.target.checked)}
                className="h-4 w-4 bg-slate-800 border-slate-700 rounded text-[#81E4F2] focus:ring-[#81E4F2]"
              />
              <label htmlFor="showBtc" className="ml-2 text-sm text-slate-300">
                Show BTC wallet address on profile
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Action buttons at the bottom */}
      <div className="flex justify-end gap-2 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-slate-700 rounded-md text-gray-300 hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-[#0ea5e9] text-white rounded-md hover:bg-[#0284c7]"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
} 