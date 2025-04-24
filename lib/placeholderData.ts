import { v4 as uuidv4 } from "uuid";
import { ProfileData, SpotlightItem, MediaItem, ShopItem, GalleryItem } from "@/types";

/**
 * This file contains placeholder data that can be used in development mode
 * or as initial content for new user profiles
 */

// Placeholder profile data
export const placeholderProfile: ProfileData = {
  id: uuidv4(),
  name: "Jane Doe",
  title: "Web3 Creator & Digital Artist",
  bio: "I'm a digital artist exploring the intersection of art and technology. I create unique digital experiences and collectible artwork.",
  image: "/placeholder-images/profile-image.jpg", // This should be added to the placeholder-images folder
  socialLinks: [
    { platform: "twitter", url: "https://twitter.com/example" },
    { platform: "instagram", url: "https://instagram.com/example" },
    { platform: "youtube", url: "https://youtube.com/@example" }
  ],
  sectionVisibility: {
    spotlight: true,
    media: true,
    shop: true,
    gallery: true,
    sticker: true
  },
  sticker: {
    id: "daisy-blue",
    visible: true
  },
  showWalletAddress: true,
  showBtcAddress: true
};

// Placeholder spotlight items
export const placeholderSpotlightItems: SpotlightItem[] = [
  {
    id: uuidv4(),
    title: "Latest Collection",
    description: "My newest digital art collection exploring abstract landscapes",
    image: "/placeholder-images/spotlight-1.jpg", // To be added
    link: "https://example.com/collection"
  },
  {
    id: uuidv4(),
    title: "Community Project",
    description: "A collaborative project with artists from around the world",
    image: "/placeholder-images/spotlight-2.jpg", // To be added
    link: "https://example.com/community"
  },
  {
    id: uuidv4(),
    title: "Featured Work",
    description: "This piece was featured in the Digital Art Annual 2023",
    image: "/placeholder-images/spotlight-3.jpg", // To be added
    link: "https://example.com/featured"
  }
];

// Placeholder media items
export const placeholderMediaItems: MediaItem[] = [
  {
    id: uuidv4(),
    type: "youtube",
    rawUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: uuidv4(),
    type: "spotify",
    rawUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
    embedUrl: "https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT"
  },
  {
    id: uuidv4(),
    type: "soundcloud",
    rawUrl: "https://soundcloud.com/example/sample-track",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/123456789"
  }
];

// Placeholder shop items
export const placeholderShopItems: ShopItem[] = [
  {
    id: uuidv4(),
    title: "Digital Art Print",
    description: "Limited edition print, signed and numbered",
    image: "/placeholder-images/shop-1.jpg", // To be added
    link: "https://example.com/shop/print"
  },
  {
    id: uuidv4(),
    title: "NFT Collection",
    description: "Exclusive digital collectibles with unique properties",
    image: "/placeholder-images/shop-2.jpg", // To be added
    link: "https://example.com/shop/nft"
  },
  {
    id: uuidv4(),
    title: "Creative Workshop",
    description: "Join my online workshop to learn digital art techniques",
    image: "/placeholder-images/shop-3.jpg", // To be added
    link: "https://example.com/shop/workshop"
  }
];

// Placeholder gallery items
export const placeholderGalleryItems: GalleryItem[] = [
  {
    id: uuidv4(),
    image: "/placeholder-images/gallery-1.jpg", // To be added
    createdAt: new Date(2023, 5, 15).toISOString()
  },
  {
    id: uuidv4(),
    image: "/placeholder-images/gallery-2.jpg", // To be added
    createdAt: new Date(2023, 6, 20).toISOString()
  },
  {
    id: uuidv4(),
    image: "/placeholder-images/gallery-3.jpg", // To be added
    createdAt: new Date(2023, 7, 10).toISOString()
  }
];

// Function to get all placeholder data in one object
export function getPlaceholderData() {
  return {
    profile: placeholderProfile,
    spotlightItems: placeholderSpotlightItems,
    mediaItems: placeholderMediaItems,
    shopItems: placeholderShopItems,
    galleryItems: placeholderGalleryItems
  };
} 