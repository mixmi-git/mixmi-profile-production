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
    sticker: boolean;
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
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
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
  STICKER: "sticker",
  AUTH: "auth"
};

export type StorageKeysType = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]; 