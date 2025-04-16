"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProfileData, STORAGE_KEYS } from "@/types";
import { StorageService } from "@/lib/storage";
import { useDebounce } from "@/hooks/useDebounce";

// Default profile data
const defaultProfile: ProfileData = {
  id: "",
  name: "",
  title: "",
  bio: "",
  image: "",
  socialLinks: [],
  sectionVisibility: {
    spotlight: true,
    media: true,
    shop: true,
    sticker: true
  },
  showWalletAddress: false,
  showBtcAddress: false
};

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  isSaving: boolean;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use the debounce hook to prevent too many saves
  const debouncedProfile = useDebounce(profile, 1000);
  
  // Load profile from storage on initial render
  useEffect(() => {
    const storedProfile = StorageService.getItem<ProfileData>(STORAGE_KEYS.PROFILE, defaultProfile);
    setProfile(storedProfile);
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
    <ProfileContext.Provider value={{ profile, updateProfile, isSaving }}>
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