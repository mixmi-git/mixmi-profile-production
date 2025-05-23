export interface ProfileData {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
  sectionVisibility: {
    spotlight: boolean;
    media: boolean;
    shop: boolean;
    gallery: boolean;
    sticker: boolean;
  };
  sectionTitles: {
    spotlight: string;
    media: string;
    shop: string;
    gallery: string;
    sticker: string;
  };
  walletAddress?: string;
  showWalletAddress: boolean;
  btcAddress?: string;
  showBtcAddress: boolean;
  sticker: {
    id: string;
    visible: boolean;
  };
}

export interface SpotlightItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  date?: string;
  category?: string;
}

export interface MediaItem {
  id: string;
  type: string; // youtube, spotify, soundcloud, etc.
  title?: string;
  rawUrl: string;
  embedUrl?: string;
  link?: string; // External link to the media source
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  createdAt?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
  displayName?: string;
}

export const STORAGE_KEYS = {
  PROFILE: "profile",
  SPOTLIGHT: "spotlight",
  MEDIA: "media",
  SHOP: "shop",
  GALLERY: "gallery",
  STICKER: "sticker",
  AUTH: "auth"
};

export type StorageKeysType = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

export type StickerId = 
  | 'daisy-purple' 
  | 'daisy-pink' 
  | 'daisy-yellow' 
  | 'daisy-white'
  | 'daisy-blue'
  | 'moto-wheel-2'
  | 'gear-shiny'
  | 'lemon-slice'
  | 'lime-slice'
  | 'orange-slice'
  | 'pineapple-slice'
  | 'strawberry-slice';

export interface Sticker {
  id: StickerId;
  imageUrl: string;
  alt: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
  sectionVisibility: {
    spotlight: boolean;
    media: boolean;
    shop: boolean;
    gallery: boolean;
    sticker: boolean;
  };
  walletAddress?: string;
  showWalletAddress: boolean;
  btcAddress?: string;
  showBtcAddress: boolean;
  sticker: {
    id: StickerId | null;
    visible: boolean;
  };
} 