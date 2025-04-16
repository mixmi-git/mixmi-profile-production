"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProfileData, SpotlightItem, MediaItem, ShopItem, STORAGE_KEYS } from "@/types";
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
  socialLinks: [
    {
      platform: "twitter",
      url: "https://twitter.com/example",
    },
    {
      platform: "instagram",
      url: "https://instagram.com/example",
    },
    {
      platform: "youtube",
      url: "https://youtube.com/example",
    },
    {
      platform: "spotify",
      url: "https://spotify.com/example",
    }
  ],
  sectionVisibility: {
    spotlight: true,
    media: true,
    shop: true,
    sticker: true
  },
  sticker: {
    id: "daisy-blue",
    visible: true
  },
  showWalletAddress: true,
  showBtcAddress: true
};

export interface ProfileContextType {
  profile: ProfileData;
  spotlightItems: SpotlightItem[];
  mediaItems: MediaItem[];
  shopItems: ShopItem[];
  updateProfile: (updates: Partial<ProfileData>) => void;
  addSpotlightItem: (item: SpotlightItem) => void;
  updateSpotlightItem: (id: string, item: SpotlightItem) => void;
  removeSpotlightItem: (id: string) => void;
  updateAllSpotlightItems: (items: SpotlightItem[]) => void;
  addMediaItem: (item: MediaItem) => void;
  updateMediaItem: (id: string, item: MediaItem) => void;
  removeMediaItem: (id: string) => void;
  updateAllMediaItems: (items: MediaItem[]) => void;
  addShopItem: (item: ShopItem) => void;
  updateShopItem: (id: string, item: ShopItem) => void;
  removeShopItem: (id: string) => void;
  updateAllShopItems: (items: ShopItem[]) => void;
  isSaving: boolean;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use the debounce hook to prevent too many saves
  const debouncedProfile = useDebounce(profile, 1000);
  
  // Load data from storage on initial render
  useEffect(() => {
    const storedProfile = StorageService.getItem<ProfileData>(STORAGE_KEYS.PROFILE, defaultProfile);
    
    // Ensure all fields from defaultProfile are present in the loaded profile
    setProfile({
      ...defaultProfile,
      ...storedProfile,
      // Make sure nested objects are properly merged
      sectionVisibility: {
        ...defaultProfile.sectionVisibility,
        ...(storedProfile.sectionVisibility || {})
      },
      // Ensure sticker object exists
      sticker: {
        ...defaultProfile.sticker,
        ...(storedProfile.sticker || {})
      }
    });
    
    const storedSpotlightItems = StorageService.getItem<SpotlightItem[]>(STORAGE_KEYS.SPOTLIGHT, []);
    setSpotlightItems(storedSpotlightItems);
    
    const storedMediaItems = StorageService.getItem<MediaItem[]>(STORAGE_KEYS.MEDIA, []);
    setMediaItems(storedMediaItems);
    
    const storedShopItems = StorageService.getItem<ShopItem[]>(STORAGE_KEYS.SHOP, []);
    setShopItems(storedShopItems);
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
  
  // Add a new spotlight item
  const addSpotlightItem = (item: SpotlightItem) => {
    const newItems = [...spotlightItems, item];
    setSpotlightItems(newItems);
    StorageService.setItem(STORAGE_KEYS.SPOTLIGHT, newItems);
  };
  
  // Update an existing spotlight item
  const updateSpotlightItem = (id: string, updatedItem: SpotlightItem) => {
    const newItems = spotlightItems.map(item => 
      item.id === id ? updatedItem : item
    );
    setSpotlightItems(newItems);
    StorageService.setItem(STORAGE_KEYS.SPOTLIGHT, newItems);
  };
  
  // Remove a spotlight item
  const removeSpotlightItem = (id: string) => {
    const newItems = spotlightItems.filter(item => item.id !== id);
    setSpotlightItems(newItems);
    StorageService.setItem(STORAGE_KEYS.SPOTLIGHT, newItems);
  };
  
  // Update all spotlight items at once (for reordering)
  const updateAllSpotlightItems = (items: SpotlightItem[]) => {
    setSpotlightItems(items);
    StorageService.setItem(STORAGE_KEYS.SPOTLIGHT, items);
  };
  
  // Add a new media item
  const addMediaItem = (item: MediaItem) => {
    const newItems = [...mediaItems, item];
    setMediaItems(newItems);
    StorageService.setItem(STORAGE_KEYS.MEDIA, newItems);
  };
  
  // Update an existing media item
  const updateMediaItem = (id: string, updatedItem: MediaItem) => {
    const newItems = mediaItems.map(item => 
      item.id === id ? updatedItem : item
    );
    setMediaItems(newItems);
    StorageService.setItem(STORAGE_KEYS.MEDIA, newItems);
  };
  
  // Remove a media item
  const removeMediaItem = (id: string) => {
    const newItems = mediaItems.filter(item => item.id !== id);
    setMediaItems(newItems);
    StorageService.setItem(STORAGE_KEYS.MEDIA, newItems);
  };
  
  // Update all media items at once (for reordering)
  const updateAllMediaItems = (items: MediaItem[]) => {
    setMediaItems(items);
    StorageService.setItem(STORAGE_KEYS.MEDIA, items);
  };
  
  // Add a new shop item
  const addShopItem = (item: ShopItem) => {
    const newItems = [...shopItems, item];
    setShopItems(newItems);
    StorageService.setItem(STORAGE_KEYS.SHOP, newItems);
  };
  
  // Update an existing shop item
  const updateShopItem = (id: string, updatedItem: ShopItem) => {
    const newItems = shopItems.map(item => 
      item.id === id ? updatedItem : item
    );
    setShopItems(newItems);
    StorageService.setItem(STORAGE_KEYS.SHOP, newItems);
  };
  
  // Remove a shop item
  const removeShopItem = (id: string) => {
    const newItems = shopItems.filter(item => item.id !== id);
    setShopItems(newItems);
    StorageService.setItem(STORAGE_KEYS.SHOP, newItems);
  };
  
  // Update all shop items at once (for reordering)
  const updateAllShopItems = (items: ShopItem[]) => {
    setShopItems(items);
    StorageService.setItem(STORAGE_KEYS.SHOP, items);
  };
  
  return (
    <ProfileContext.Provider value={{ 
      profile, 
      spotlightItems, 
      mediaItems, 
      shopItems,
      updateProfile,
      addSpotlightItem,
      updateSpotlightItem,
      removeSpotlightItem,
      updateAllSpotlightItems,
      addMediaItem,
      updateMediaItem,
      removeMediaItem,
      updateAllMediaItems,
      addShopItem,
      updateShopItem,
      removeShopItem,
      updateAllShopItems,
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