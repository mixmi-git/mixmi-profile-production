"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProfileData, SpotlightItem, MediaItem, STORAGE_KEYS } from "@/types";
import { StorageService } from "@/lib/storage";
import { useDebounce } from "@/hooks/useDebounce";
import { v4 as uuidv4 } from "uuid";

// Default profile data
const defaultProfile: ProfileData = {
  id: uuidv4(),
  name: "Add Your Name",
  title: "Add Your Title",
  bio: "Tell us about yourself...",
  image: "",
  socialLinks: [],
  sectionVisibility: {
    spotlight: true,
    media: true,
    shop: true,
    sticker: true
  },
  showWalletAddress: false,
  showBtcAddress: false,
  sticker: {
    id: "", // Empty string means no sticker selected
    visible: true
  }
};

interface ProfileContextType {
  profile: ProfileData;
  spotlightItems: SpotlightItem[];
  mediaItems: MediaItem[];
  updateProfile: (updates: Partial<ProfileData>) => void;
  isSaving: boolean;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use the debounce hook to prevent too many saves
  const debouncedProfile = useDebounce(profile, 1000);
  
  // Load data from storage on initial render
  useEffect(() => {
    const storedProfile = StorageService.getItem<ProfileData>(STORAGE_KEYS.PROFILE, defaultProfile);
    setProfile(storedProfile);
    
    const storedSpotlightItems = StorageService.getItem<SpotlightItem[]>(STORAGE_KEYS.SPOTLIGHT, []);
    setSpotlightItems(storedSpotlightItems);
    
    const storedMediaItems = StorageService.getItem<MediaItem[]>(STORAGE_KEYS.MEDIA, []);
    setMediaItems(storedMediaItems);
  }, []);
  
  // Save profile when it changes (debounced)
  useEffect(() => {
    // Skip the initial load
    if (debouncedProfile === defaultProfile) return;
    
    setIsSaving(true);
    
    // Save to storage
    StorageService.setItem(STORAGE_KEYS.PROFILE, debouncedProfile);
    
    // Simulate API call or processing time
    const timer = setTimeout(() => {
      setIsSaving(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [debouncedProfile]);
  
  // Update profile data
  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  return (
    <ProfileContext.Provider value={{ 
      profile, 
      spotlightItems, 
      mediaItems, 
      updateProfile, 
      isSaving 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}; 