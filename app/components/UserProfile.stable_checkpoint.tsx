/** @jsxImportSource react */
'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useCallback, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Youtube, Music2, CloudRain, Twitter, Edit2, Upload, User, Linkedin, Instagram } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { debounce } from "lodash"
import ReactCrop, { Crop as CropType } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useAuthState } from "@/hooks/useAuthState"
import { exampleProjects, exampleMediaItems, exampleShopItems } from '@/lib/example-content'
import { SocialLinks } from "@/components/profile/SocialLinks"
import { SpotlightSection } from "@/components/profile/SpotlightSection"
import { MediaSection } from "@/components/profile/MediaSection"
import { ShopSection } from "@/components/profile/ShopSection"
import ErrorBoundary from './ui/ErrorBoundary'
import { StickerSection } from "@/components/profile/StickerSection"
import { 
  transformSoundCloudUrl, 
  transformAppleMusicUrl, 
  detectMediaType, 
  transformMixcloudUrl,
  transformSpotifyUrl
} from '@/lib/mediaUtils'
import { MediaType } from '@/types/media'
import { useProfileState } from '@/hooks/useProfileState'
import { NavbarContainer } from '@/components/profile/NavbarContainer'
import { useAuth } from '@/lib/auth'
import { AuthDebug } from './AuthDebug'
import { SpotlightItem as SpotlightItemType, ShopItem as ShopItemType, Profile as ProfileType, SocialLink, Project as ProjectType } from '../types/content'
import { useMediaState } from '@/hooks/useMediaState'

/* eslint-disable react-hooks/exhaustive-deps */

// Add custom TikTok icon component
const TikTokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 sm:h-6 sm:w-6"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

interface NavbarProps {
  isAuthenticated: boolean;
  onLoginToggle: () => void;
}

// Define local type aliases that are compatible with imported types
export type Project = ProjectType;
export type SpotlightItem = SpotlightItemType;
export type ShopItem = ShopItemType;

export interface MediaItem {
  id: string;
  title?: string;
  type: 'youtube' | 'soundcloud' | 'soundcloud-playlist' | 'spotify' | 'spotify-playlist' | 'apple-music-playlist' | 'apple-music-album' | 'apple-music-station' | 'mixcloud' | 'instagram-reel' | 'tiktok';
  embedUrl?: string;
  rawUrl?: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
  sectionVisibility: {
    projects: boolean;
    media: boolean;
    shop: boolean;
  };
  spotlightDescription: string;
}

// Update the FormErrors interface to be more specific
interface FormErrors {
  name: {
    message: string;
    isValid: boolean;
  };
  title: {
    message: string;
    isValid: boolean;
  };
  bio: {
    message: string;
    isValid: boolean;
  };
  socialLinks: {
    message: string;
    isValid: boolean;
  }[];
}

// Add validation rules
const validateProfile = (field: string, value: string): { isValid: boolean; message: string } => {
  switch (field) {
    case 'name':
      if (!value.trim()) {
        return { isValid: false, message: 'Name is required' };
      }
      if (value.length > 50) {
        return { isValid: false, message: 'Name must be less than 50 characters' };
      }
      return { isValid: true, message: '' };

    case 'title':
      if (!value.trim()) {
        return { isValid: false, message: 'Title is required' };
      }
      if (value.length > 100) {
        return { isValid: false, message: 'Title must be less than 100 characters' };
      }
      return { isValid: true, message: '' };

    case 'bio':
      if (!value.trim()) {
        return { isValid: false, message: 'Bio is required' };
      }
      if (value.length > 500) {
        return { isValid: false, message: 'Bio must be less than 500 characters' };
      }
      return { isValid: true, message: '' };

    default:
      return { isValid: true, message: '' };
  }
};

interface Sticker {
  enabled: boolean;
  image: string;
}

// Add these interfaces
interface CropState {
  crop: CropType;
  aspect: number;
  imageRef: HTMLImageElement | null;
  completedCrop: CropType | null;
}

interface FileWithPreview extends File {
  preview?: string;
}

// Add this component before the main Component
const MediaEmbed = memo(({ item }: { item: MediaItem }) => {
  const getAspectRatio = () => {
    switch (item.type) {
      case 'youtube':
        return 'pb-[56.25%]' // 16:9 ratio
      case 'soundcloud':
        return 'pb-[300px]'  // Fixed height for tracks
      case 'soundcloud-playlist':
        return 'pb-[400px]'  // Taller height for playlists
      case 'spotify':
        return 'pb-[152px]'  // Single track
      case 'spotify-playlist':
        return 'pb-[380px]'  // Playlist height
      case 'apple-music-album':
        return 'pb-[175px]'  // Height for album
      case 'apple-music-playlist':
        return 'pb-[450px]'  // Height for playlist
      case 'apple-music-station':
        return 'pb-[175px]'  // Height for station
      case 'mixcloud':
        return 'pb-[400px]'  // Height for Mixcloud shows
      case 'instagram-reel':
        return 'pb-[125%]'  // Instagram's aspect ratio
      default:
        return 'pb-[56.25%]'
    }
  }

  switch (item.type) {
    case 'youtube':
      // Extract video ID from full embed URL if needed
      const videoId = item.id.includes('embed/') 
        ? item.id.split('embed/')[1]
        : item.id.replace('https://www.youtube.com/embed/', '');
      
      return (
        <div className="max-w-2xl mx-auto">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title="YouTube video player"
              frameBorder="0"
            />
          </div>
        </div>
      )
    case 'soundcloud':
    case 'soundcloud-playlist':
      return (
        <div className={`relative ${getAspectRatio()} h-0`}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={item.id}
            style={{ background: 'transparent' }}  // Add this to fix black background
          />
        </div>
      )
    case 'spotify':
    case 'spotify-playlist':
      return (
        <div className="max-w-2xl mx-auto">
          <div className={`relative ${getAspectRatio()} h-0`}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={item.id}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ 
                background: 'transparent',
                borderRadius: '10px'
              }}
              frameBorder="0"
            />
          </div>
        </div>
      )
    case 'apple-music-album':
    case 'apple-music-playlist':
    case 'apple-music-station':
      return (
        <div className="max-w-2xl mx-auto">
          <div className={`relative ${getAspectRatio()} h-0`}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay *; encrypted-media *; fullscreen *"
              frameBorder="0"
              height="450"
              style={{
                width: '100%',
                maxWidth: '660px',
                overflow: 'hidden',
                background: 'transparent',
                borderRadius: '10px'
              }}
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={item.id}
            />
          </div>
        </div>
      )
    case 'mixcloud':
      return (
        <div className={`relative ${getAspectRatio()} h-0`}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={item.id}
            frameBorder="0"
            allow="autoplay"
            style={{ background: 'transparent' }}
          />
        </div>
      )
    case 'instagram-reel':
      return (
        <div className={`relative ${getAspectRatio()} h-0`}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={item.id}
            frameBorder="0"
            allowFullScreen
            scrolling="no"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            loading="lazy"
          />
        </div>
      )
    default:
      return null
  }
})

MediaEmbed.displayName = 'MediaEmbed'

const defaultStickerImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png"

// Update the ProjectCard component for a more visual layout
const ProjectCard = ({ project }: { project: Project }) => {
  console.log('ProjectCard render:', { title: project.title });
  
  const CardContent = (
    <>
      <div className="relative aspect-[16/9] bg-gray-800/50">
        <Image
          src={project.image || '/images/next-event-placeholder.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-100 mb-2 line-clamp-2 whitespace-pre-wrap break-words">
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-3 whitespace-pre-wrap break-words">
          {project.description}
        </p>
      </div>
    </>
  );

  return (
    <Card className="overflow-hidden group hover:border-cyan-300/50 transition-all duration-300">
      {CardContent}
    </Card>
  );
};

export default function Component(): JSX.Element {
  // Get authentication state directly from useAuth
  const { isAuthenticated, userAddress, connectWallet, disconnectWallet, isInitialized, refreshAuthState } = useAuth()
  
  // Add a local state to track the auth state for rendering purposes
  // TEMPORARY FIX: Always set to true to ensure Edit Profile button is visible
  const [isAuthenticatedLocal, setIsAuthenticatedLocal] = useState(true)
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false)
  
  // IMPORTANT: Force check authentication on mount
  useEffect(() => {
    console.log('%c AUTH DIRECT CHECK ON MOUNT', 'background-color: #0f172a; color: #f97316; font-size: 14px; padding: 4px;');
    
    // Force a refresh of the auth state immediately
    refreshAuthState();
    
    // Then force a direct check from the auth provider
    setTimeout(() => {
      // Force update the local state based on the auth state
      const hasWalletAddress = typeof userAddress === 'string' && userAddress.trim() !== '';
      const isUserAuthenticated = isAuthenticated === true || hasWalletAddress;
      
      console.log('%c FORCE AUTH UPDATE:', 'background-color: #0f172a; color: #f97316; font-size: 14px; padding: 4px;', {
        isUserAuthenticated,
        isAuthenticated,
        hasWalletAddress,
        userAddress
      });
      
      // Force set the authenticated state
      setIsAuthenticatedLocal(isUserAuthenticated);
    }, 500);
  }, [refreshAuthState, userAddress, isAuthenticated]);
  
  // Add enhanced debugging for authentication state
  useEffect(() => {
    // More prominent logging to track auth state changes
    console.log('%c AUTH STATE IN USERPROFILE:', 'background-color: #0f172a; color: #06b6d4; font-size: 14px; padding: 4px;', { 
      isAuthenticated, 
      userAddress,
      isInitialized,
      isEditing,
      time: new Date().toISOString()
    })
    
    // Set our local authentication state with more thorough checks
    // Consider user authenticated if isAuthenticated is true OR we have a non-empty wallet address
    const hasWalletAddress = typeof userAddress === 'string' && userAddress.trim() !== '';
    const isUserAuthenticated = isAuthenticated === true || hasWalletAddress;
    
    console.log('%c AUTH LOCAL STATE UPDATE:', 'background-color: #0f172a; color: #22c55e; font-size: 12px; padding: 3px;', { 
      isUserAuthenticated,
      isAuthenticated,
      hasWalletAddress,
      userAddress
    });
    
    setIsAuthenticatedLocal(isUserAuthenticated);
  }, [isAuthenticated, userAddress, isInitialized, isEditing]);
  
  // Add a polling mechanism to regularly check auth state
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh auth state every 2 seconds
      refreshAuthState();
      
      // Re-evaluate local auth state based on current values
      const hasWalletAddress = typeof userAddress === 'string' && userAddress.trim() !== '';
      const isUserAuthenticated = isAuthenticated === true || hasWalletAddress;
      setIsAuthenticatedLocal(isUserAuthenticated);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [refreshAuthState, isAuthenticated, userAddress]);
  
  // Reset editing mode when user disconnects
  useEffect(() => {
    if (!isAuthenticated && isEditing) {
      console.log('User disconnected, exiting edit mode at', new Date().toISOString())
      setIsEditing(false)
    }
  }, [isAuthenticated, isEditing])

  // Local state for transitions
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // State for image cropping
  const [tempImage, setTempImage] = useState('')
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [cropState, setCropState] = useState<CropState>({
    crop: {
      unit: '%',
      width: 100,
      height: 100,
      x: 0,
      y: 0
    },
    aspect: 1,
    imageRef: null,
    completedCrop: null
  })
  
  // Use the new profile state hook
  const { 
    profile, 
    setProfile, 
    formErrors, 
    setFormErrors, 
    handleProfileChange,
    handleSectionVisibilityToggle,
    handleSocialLinkChange,
    resetProfile
  } = useProfileState()

  const [sticker, setSticker] = useState<Sticker>({
    enabled: true,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/daisy-blue-1sqZRfemKwLyREL0Eo89EfmQUT5wst.png"
  })

  const [isLoading, setIsLoading] = useState(true)
  
  // Set loading to false after initial render
  useEffect(() => {
    // Short timeout to allow for any initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const saveToLocalStorage = (data: {
    profile: typeof profile;
    projects: Project[];
    mediaItems: MediaItem[];
    sticker: Sticker;
    shopItems: ShopItem[];
    spotlightItems: SpotlightItem[];
  }) => {
    try {
      const storageKey = `userProfile_${userAddress}`
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  const loadFromLocalStorage = useCallback(() => {
    try {
      const storageKey = `userProfile_${userAddress}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        const hasUserSpotlightContent = Array.isArray(data.spotlightItems) && data.spotlightItems.length > 0
        
        if (hasUserSpotlightContent) {
          setSpotlightItems(data.spotlightItems)
          setIsUsingExampleContent(false)
        } else {
          setSpotlightItems(exampleProjects)
          setIsUsingExampleContent(true)
        }

        // Update profile using the new setter
        if (data.profile) {
          setProfile(data.profile)
        }

        return {
          profile: data.profile || profile,
          projects: data.projects || [],
          mediaItems: data.mediaItems || [],
          sticker: data.sticker || { enabled: true, image: defaultStickerImage },
          shopItems: Array.isArray(data.shopItems) ? data.shopItems : [],
          spotlightItems: hasUserSpotlightContent ? data.spotlightItems : exampleProjects,
        }
      }
      return null
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      return null
    }
  }, [userAddress, setProfile, profile])

  // Load saved data after successful connection
  useEffect(() => {
    const saved = loadFromLocalStorage()
    if (saved) {
      setShopItems(saved.shopItems)
      setSpotlightItems(saved.spotlightItems)
    }
  }, [loadFromLocalStorage])

  const [projects, setProjects] = useState<Project[]>([])

  // Use the media state hook
  const { 
    mediaItems, 
    setMediaItems, 
    videosLoading, 
    addMedia, 
    removeMedia, 
    handleMediaChange 
  } = useMediaState(exampleMediaItems)
  
  const [spotlightItems, setSpotlightItems] = useState<SpotlightItem[]>(exampleProjects)
  const [shopItems, setShopItems] = useState<ShopItem[]>([])

  const [isUsingExampleContent, setIsUsingExampleContent] = useState(true)

  const handleCropComplete = async (crop: CropType) => {
    if (!cropState.imageRef || !crop.width || !crop.height) {
      console.error('Missing required crop data')
      return
    }

    try {
      const canvas = document.createElement('canvas')
      const scaleX = cropState.imageRef.naturalWidth / cropState.imageRef.width
      const scaleY = cropState.imageRef.naturalHeight / cropState.imageRef.height

      canvas.width = crop.width
      canvas.height = crop.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Failed to get canvas context')
        return
      }

      ctx.drawImage(
        cropState.imageRef,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )

      const base64Image = canvas.toDataURL('image/jpeg', 0.9)
      setProfile(prev => ({ ...prev, image: base64Image }))

      setShowCropDialog(false)
      setTempImage('')
      setImageLoading(false)
      setImageError(null)
    } catch (error) {
      console.error('Failed to complete crop:', error)
      setImageError('Failed to crop image')
    }
  }

  const handleSave = async () => {
    try {
      console.log('Saving profile with shop items and spotlight:', shopItems, spotlightItems)
      saveToLocalStorage({
        profile,
        projects,
        mediaItems,
        sticker,
        shopItems,
        spotlightItems
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const ImageDisplay = () => (
    <div
      className="relative w-32 h-32 overflow-hidden rounded-lg"
      role="img"
      aria-label={imageError ? "Error loading profile image" : "Profile image"}
    >
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      )}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-red-500">
          <p className="text-sm text-center px-2">{imageError}</p>
        </div>
      )}
      <Image
        src={profile.image}
        alt="Profile"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`rounded-lg object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
        onLoad={() => setImageLoading(false)}
        onError={() => setImageError("Failed to load image")}
      />
    </div>
  )

  const [projectsLoading, setProjectsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setProjectsLoading(false), 800)
  }, [])

  // Update displayProjects computation to handle type compatibility
  const displayProjects = spotlightItems === exampleProjects || spotlightItems.length === 0 
    ? exampleProjects 
    : spotlightItems as SpotlightItemType[];

  const displayMedia = mediaItems.length > 0 ? mediaItems : exampleMediaItems;

  // Update displayShop computation to handle type compatibility
  const displayShop = shopItems.length > 0 ? shopItems as ShopItemType[] : exampleShopItems;

  const handleShopImageChange = (index: number, file: File | null) => {
    if (file) {
      const isValidImage = file.type.startsWith('image/')

      if (!isValidImage) {
        console.error("Please upload an image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setShopItems(prev => prev.map((item, i) =>
          i === index ? { ...item, image: reader.result as string } : item
        ))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSpotlightChange = (index: number, field: keyof SpotlightItem, value: string) => {
    const updatedItems = [...spotlightItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setSpotlightItems(updatedItems);
    debouncedSave({
      profile,
      projects,
      mediaItems,
      sticker,
      shopItems,
      spotlightItems: updatedItems
    });
  };

  const handleAddSpotlight = () => {
    const newItems = [
      ...(isUsingExampleContent ? [] : spotlightItems),
      {
        id: Date.now(),
        title: '',
        description: '',
        image: '',
        link: ''
      }
    ];
    setSpotlightItems(newItems);
    setIsUsingExampleContent(false);
    debouncedSave({
      profile,
      projects,
      mediaItems,
      sticker,
      shopItems,
      spotlightItems: newItems
    });
  };

  const handleRemoveSpotlight = (index: number) => {
    const updatedItems = spotlightItems.filter((_, i) => i !== index);
    setSpotlightItems(updatedItems);
    debouncedSave({
      profile,
      projects,
      mediaItems,
      sticker,
      shopItems,
      spotlightItems: updatedItems
    });
  };

  const handleSpotlightImageChange = (index: number, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedItems = [...spotlightItems];
        updatedItems[index] = {
          ...updatedItems[index],
          image: reader.result as string
        };
        setSpotlightItems(updatedItems);
        debouncedSave({
          profile,
          projects,
          mediaItems,
          sticker,
          shopItems,
          spotlightItems: updatedItems
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const [previewMode, setPreviewMode] = useState(true);

  // New helper functions
  const resetProfileState = useCallback(() => {
    resetProfile()
    setProjects([])
    setMediaItems([])
    setShopItems([])
    setSpotlightItems(exampleProjects)
    setSticker({
      enabled: true,
      image: defaultStickerImage
    })
    setIsUsingExampleContent(true)
    setIsEditing(false)
    setShowCropDialog(false)
    setTempImage('')
    setImageError(null)
    setImageLoading(false)
  }, [resetProfile])

  const restoreProfileState = (saved: ReturnType<typeof loadFromLocalStorage>) => {
    if (!saved) return;
    setProfile(saved.profile)
    setMediaItems(saved.mediaItems)
    setShopItems(saved.shopItems)
    setSpotlightItems(saved.spotlightItems)
    setSticker(saved.sticker)
    setIsUsingExampleContent(false)
  }

  // Add sticker handlers
  const handleStickerChange = (checked: boolean) => {
    console.log('Sticker enabled changed:', checked)
    setSticker(prev => ({
      ...prev,
      enabled: checked
    }))
  }

  // Function to handle image files being dropped
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange(e.dataTransfer.files[0])
    }
  }

  // Function to handle dragover event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Function to handle file input change
  const handleImageChange = (file: File) => {
    setImageError(null)
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB')
      return
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setImageError('Image must be JPG, PNG, or GIF')
      return
    }
    
    setImageLoading(true)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setTempImage(e.target.result as string)
        setShowCropDialog(true)
        setImageLoading(false)
      }
    }
    
    reader.onerror = () => {
      setImageError('Error reading file')
      setImageLoading(false)
    }
    
    reader.readAsDataURL(file)
  }

  // Create a debounced save function
  const debouncedSave = useCallback(
    debounce((data: any) => {
      saveToLocalStorage(data);
    }, 500),
    [saveToLocalStorage]
  );

  // Add handlers for form inputs
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleProfileChange('name', value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleProfileChange('title', value);
  };
  
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    handleProfileChange('bio', value);
  };
  
  // Add social link handlers
  const addSocialLink = () => {
    const newLink = { platform: "instagram", url: "" };
    setProfile(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));
  };
  
  const removeSocialLink = (index: number) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="dark min-h-screen bg-gray-900 text-gray-100">
      <NavbarContainer />
      <AuthDebug />
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      ) : (
        <>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .sticker-rotate {
                animation: rotate 20s linear infinite;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.5s ease-out;
              }
            `
          }} />
          <div className="p-4 sm:p-8 md:p-12 lg:p-16 min-h-screen flex flex-col">
            <div className={`max-w-6xl mx-auto w-full flex-grow transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}>
              {isAuthenticated && isEditing ? (
                <div className="space-y-8 rounded-lg bg-gray-800/50 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-cyan-300">Profile Details</h3>
                    <div className="flex-grow border-t border-gray-700" />
                  </div>
                  <p className="text-sm text-gray-400 mb-8">
                    Welcome to your creative space! This is your personal corner of the web where you can showcase your work, share your media, and connect with your audience. Think of it as your own customizable mini-site with built-in marketplace features. Make it uniquely yours.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSave()
                    }}
                    className="space-y-16"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                      }
                    }}
                  >
                    <div className="space-y-8">
                      <div>
                        <Label htmlFor="profileImage">Profile Image</Label>
                        <div
                          role="button"
                          aria-label="Upload profile image"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <ImageDisplay />
                            <div className="text-center">
                              <p className="text-sm text-gray-300">
                                Drag & drop an image here, or click to select one
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                Supports JPG, PNG, and GIFs under 5MB
                              </p>
                            </div>
                            <Label htmlFor="fileInput" className="cursor-pointer">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                aria-label="Upload profile image"
                                onClick={() => {
                                  document.getElementById('fileInput')?.click()
                                }}
                              >
                                <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                                Upload Image
                              </Button>
                            </Label>
                            <Input
                              id="fileInput"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const files = e.target.files
                                if (files && files.length > 0) {
                                  handleImageChange(files[0])
                                  e.target.value = ''
                                }
                              }}
                              className="hidden"
                            />
                          </div>
                        </div>
                        {imageError && (
                          <p className="mt-2 text-sm text-red-500">{imageError}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profile.name}
                          onChange={handleNameChange}
                          className={`mt-1 whitespace-pre-wrap break-words ${!formErrors.name.isValid ? 'border-red-500 focus:ring-red-500' : ''}`}
                          aria-invalid={!formErrors.name.isValid}
                          aria-describedby={!formErrors.name.isValid ? "name-error" : undefined}
                        />
                        {!formErrors.name.isValid && (
                          <p className="text-sm text-red-500 mt-1" id="name-error">
                            {formErrors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={profile.title}
                          onChange={handleTitleChange}
                          className={`mt-1 whitespace-pre-wrap break-words ${!formErrors.title.isValid ? 'border-red-500 focus:ring-red-500' : ''}`}
                          aria-invalid={!formErrors.title.isValid}
                          aria-describedby={!formErrors.title.isValid ? "title-error" : undefined}
                        />
                        {!formErrors.title.isValid && (
                          <p className="text-sm text-red-500 mt-1" id="title-error">
                            {formErrors.title.message}
                          </p>
                        )}
                        <p className="text-sm text-gray-400">
                          Your role or profession (e.g., &quot;Music Producer&quot; or &quot;Digital Artist&quot;)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profile.bio}
                          onChange={handleBioChange}
                          rows={4}
                          className={`mt-1 whitespace-pre-wrap break-words ${!formErrors.bio.isValid ? 'border-red-500 focus:ring-red-500' : ''}`}
                          aria-invalid={!formErrors.bio.isValid}
                          aria-describedby={!formErrors.bio.isValid ? "bio-error" : undefined}
                        />
                        {!formErrors.bio.isValid && (
                          <p className="text-sm text-red-500 mt-1" id="bio-error">
                            {formErrors.bio.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-gray-700">
                      <div>
                        <h3 className="text-xl font-semibold">Social Links</h3>
                        <SocialLinks
                          socialLinks={profile.socialLinks}
                          onSocialLinkChange={handleSocialLinkChange}
                          onAddSocialLink={addSocialLink}
                          onRemoveSocialLink={removeSocialLink}
                        />
                      </div>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-gray-700">
                      <div>
                        <h3 className="text-xl font-semibold">Section Visibility</h3>
                        <p className="text-sm text-gray-400 mt-2">
                          Choose which sections to display on your profile
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="projects-visible"
                            checked={profile.sectionVisibility.projects}
                            onCheckedChange={() => handleSectionVisibilityToggle('projects')}
                          />
                          <Label htmlFor="projects-visible">Show Spotlight section</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="media-visible"
                            checked={profile.sectionVisibility.media}
                            onCheckedChange={() => handleSectionVisibilityToggle('media')}
                          />
                          <Label htmlFor="media-visible">Show Media section</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="shop-visible"
                            checked={profile.sectionVisibility.shop}
                            onCheckedChange={() => handleSectionVisibilityToggle('shop')}
                          />
                          <Label htmlFor="shop-visible">Show Shop section</Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8 pt-8 border-t border-gray-700">
                      <ErrorBoundary>
                        <SpotlightSection
                          items={isEditing 
                            ? (isUsingExampleContent ? [] : spotlightItems as SpotlightItemType[])
                            : displayProjects
                          }
                          onItemChange={handleSpotlightChange}
                          onAddItem={handleAddSpotlight}
                          onRemoveItem={handleRemoveSpotlight}
                          onImageChange={handleSpotlightImageChange}
                          isEditing={isEditing}
                          isUsingExampleContent={isUsingExampleContent}
                        />
                      </ErrorBoundary>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-gray-700">
                      <ErrorBoundary>
                        <MediaSection 
                          mediaItems={mediaItems}
                          onMediaChange={handleMediaChange}
                          onAddMedia={addMedia}
                          onRemoveMedia={removeMedia}
                        />
                      </ErrorBoundary>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-gray-700">
                      <ErrorBoundary>
                        <ShopSection
                          items={displayShop}
                          onItemChange={(index, field, value) => {
                            const updatedItems = [...shopItems];
                            updatedItems[index] = {
                              ...updatedItems[index],
                              [field]: value,
                              ...(field === 'storeUrl' ? {
                                platform: (value.includes('shopify.com') ? 'shopify' :
                                  value.includes('etsy.com') ? 'etsy' :
                                  value.includes('gumroad.com') ? 'gumroad' :
                                  value.includes('bigcartel.com') ? 'bigcartel' : 'other')
                              } : {})
                            };
                            setShopItems(updatedItems);
                            debouncedSave({
                              profile,
                              projects,
                              mediaItems,
                              sticker,
                              shopItems: updatedItems,
                              spotlightItems
                            });
                          }}
                          onAddItem={() => {
                            const newItems = [
                              ...(isUsingExampleContent ? [] : shopItems),
                              {
                                id: Date.now(),
                                title: '',
                                storeUrl: '',
                                image: '',
                                platform: 'other' as const
                              }
                            ];
                            setShopItems(newItems);
                            setIsUsingExampleContent(false);
                            debouncedSave({
                              profile,
                              projects,
                              mediaItems,
                              sticker,
                              shopItems: newItems,
                              spotlightItems
                            });
                          }}
                          onRemoveItem={(index) => {
                            const updatedItems = shopItems.filter((_, i) => i !== index);
                            setShopItems(updatedItems);
                            debouncedSave({
                              profile,
                              projects,
                              mediaItems,
                              sticker,
                              shopItems: updatedItems,
                              spotlightItems
                            });
                          }}
                          onImageChange={handleShopImageChange}
                          isEditing={true}
                          isUsingExampleContent={isUsingExampleContent}
                        />
                      </ErrorBoundary>
                    </div>

                    <div className="space-y-8">
                      <ErrorBoundary>
                        <StickerSection
                          sticker={sticker}
                          onStickerChange={handleStickerChange}
                          onImageChange={(value) => setSticker(prev => ({ ...prev, image: value }))}
                          isEditing={true}
                        />
                      </ErrorBoundary>
                    </div>
                    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
                      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-400">
                            Changes save automatically
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => setPreviewMode(!previewMode)}
                          >
                            {previewMode ? 'Exit Preview' : 'Preview'}
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 text-lg border-2 border-cyan-300/60 hover:border-cyan-300/80 transition-colors"
                        >
                          Done Editing
                        </Button>
                      </div>
                    </div>
                  </form>
                  {showCropDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
                        <h3 className="text-xl font-bold mb-4">Crop Image</h3>
                        <div className="relative flex-1 min-h-0 overflow-auto">
                          <ReactCrop
                            crop={cropState.crop}
                            onChange={(c: CropType) => setCropState({ ...cropState, crop: c })}
                            onComplete={(c: CropType) => setCropState({ ...cropState, completedCrop: c })}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={tempImage}
                              onLoad={e => {
                                const imageRef = e.currentTarget;
                                setCropState({
                                  crop: {
                                    unit: '%',
                                    width: 90,
                                    height: 90,
                                    x: 5,
                                    y: 5
                                  },
                                  aspect: 1,
                                  imageRef,
                                  completedCrop: null
                                });
                              }}
                              alt="Crop preview"
                              className="max-w-full max-h-[calc(90vh-12rem)] w-auto mx-auto object-contain"
                            />
                          </ReactCrop>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2 pt-4 border-t border-gray-700">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowCropDialog(false)
                              setTempImage('')
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              if (cropState.completedCrop) {
                                handleCropComplete(cropState.completedCrop)
                              }
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">
                    <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
                      <div className="relative aspect-square overflow-hidden border border-cyan-300 rounded-lg">
                        <Image
                          src={profile.image}
                          alt="Artist profile photo"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-center text-center">
                      <div className="space-y-6 lg:space-y-8 max-w-sm">
                        <div>
                          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-300 whitespace-pre-wrap break-words line-clamp-2">
                            {profile.name}
                          </h1>
                          <h2 className="text-lg sm:text-xl text-gray-200 whitespace-pre-wrap break-words line-clamp-2">
                            {profile.title}
                          </h2>
                        </div>

                        <div>
                          <p className="text-sm sm:text-base text-gray-300 whitespace-pre-wrap break-words">
                            {profile.bio}
                          </p>
                        </div>

                        <div className="flex justify-center gap-4">
                          {profile.socialLinks.map((link, index) => {
                            let Icon
                            switch (link.platform) {
                              case 'youtube':
                                Icon = Youtube
                                break
                              case 'spotify':
                                Icon = Music2
                                break
                              case 'soundcloud':
                                Icon = CloudRain
                                break
                              case 'twitter':
                                Icon = Twitter
                                break
                              case 'instagram':
                                Icon = Instagram
                                break
                              case 'linkedin':
                                Icon = Linkedin
                                break
                              case 'tiktok':
                                Icon = TikTokIcon
                                break
                              default:
                                Icon = User
                            }

                            return (
                              <Button
                                key={index}
                                variant="ghost"
                                size="icon"
                                className={`w-10 h-10 sm:w-12 sm:h-12 group relative ${!link.url ? 'opacity-40 hover:opacity-100' : ''}`}
                                asChild={!!link.url}
                              >
                                {link.url ? (
                                  <a href={link.url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
                                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                    <span className="sr-only">{link.platform}</span>
                                  </a>
                                ) : (
                                  <div className="relative">
                                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                    <span className="sr-only">{link.platform}</span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                      Add {link.platform} link
                                    </div>
                                  </div>
                                )}
                              </Button>
                            )
                          })}
                        </div>

                        {/* Edit profile button - only shown when authenticated */}
                        {isAuthenticatedLocal && (
                          <Button
                            onClick={() => {
                              console.log('Edit button clicked! Auth state:', {isAuthenticated, isAuthenticatedLocal, userAddress})
                              setIsEditing(true)
                            }}
                            variant="default"
                            className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white transition-all shadow-md hover:shadow-lg"
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            <span>Edit Profile</span>
                            <span className="ml-2 text-xs text-cyan-100">(Add your content)</span>
                          </Button>
                        )}

                        {/* Debug button - temporarily visible for troubleshooting auth issues */}
                        <Button
                          onClick={() => {
                            console.log('Debug button clicked! Forcing auth refresh...');
                            refreshAuthState();
                            
                            setTimeout(() => {
                              const hasWalletAddress = typeof userAddress === 'string' && userAddress.trim() !== '';
                              const isUserAuthenticated = isAuthenticated === true || hasWalletAddress;
                              
                              console.log('Current auth state after refresh:', {
                                isUserAuthenticated,
                                isAuthenticated,
                                hasWalletAddress,
                                userAddress
                              });
                              
                              setIsAuthenticatedLocal(isUserAuthenticated);
                            }, 300);
                          }}
                          variant="outline"
                          className="mt-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                        >
                          Force Auth Check
                        </Button>

                        {/* Debug text to show auth status */}
                        <div className="mt-2 text-xs text-cyan-300">
                          Auth status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'} | 
                          Local: {isAuthenticatedLocal ? 'True' : 'False'} | 
                          Address: {userAddress ? 'Has Address' : 'No Address'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {profile.sectionVisibility.projects && (
                    <div className="mt-24 sm:mt-32 max-w-6xl mx-auto px-4 mb-24 opacity-0 animate-fadeIn"
                      style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
                      <h2 className="text-3xl font-semibold text-white text-center mb-4">
                        SPOTLIGHT
                      </h2>
                      {isUsingExampleContent && (
                        <p className="text-sm text-gray-400 text-center mb-12">
                          Share your work and favorite projects
                        </p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projectsLoading ? (
                          Array(3).fill(0).map((_, i) => (
                            <Card key={i} className="bg-gray-800/50 border-gray-700 overflow-hidden animate-pulse">
                              <div className="aspect-[3/2] bg-gray-700" />
                              <div className="p-4">
                                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-700 rounded w-1/2" />
                              </div>
                            </Card>
                          ))
                        ) : (
                          displayProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  {profile.sectionVisibility.media && (
                    <div className="mt-16 sm:mt-24 max-w-6xl mx-auto px-4 mb-24">
                      <h2 className="text-3xl font-semibold text-white text-center mb-4">
                        MEDIA
                      </h2>
                      {mediaItems.length === 0 && (
                        <p className="text-sm text-gray-400 text-center mb-12">
                          Share your music, DJ mixes, playlists and videos
                        </p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videosLoading ? (
                          Array(2).fill(0).map((_, i) => (
                            <Card key={i} className="w-full max-w-[560px] mx-auto animate-pulse">
                              <CardContent className="p-4">
                                <div className="aspect-video bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          displayMedia.map((video, index) => {
                            console.log('Rendering media item in profile:', video);
                            return (
                              <Card key={index}>
                                <MediaEmbed item={video} />
                              </Card>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                  {profile.sectionVisibility.shop && (
                    <div className="mt-16 sm:mt-24 max-w-6xl mx-auto px-4 mb-24">
                      <h2 className="text-3xl font-semibold text-white text-center mb-4">
                        SHOP
                      </h2>
                      {shopItems.length === 0 && (
                        <p className="text-sm text-gray-400 text-center mb-12">
                          Share your products, merch, and token-gated content
                        </p>
                      )}
                      <ShopSection
                        items={displayShop}
                        onItemChange={() => {}}
                        onAddItem={() => {}}
                        onRemoveItem={() => {}}
                        onImageChange={() => {}}
                        isEditing={false}
                        isUsingExampleContent={isUsingExampleContent}
                      />
                    </div>
                  )}
                  {sticker.enabled && (
                    <StickerSection
                      sticker={sticker}
                      onStickerChange={handleStickerChange}
                      onImageChange={(value) => setSticker(prev => ({ ...prev, image: value }))}
                      isEditing={false}
                    />
                  )}
                  <div className="max-w-2xl mx-auto border-t border-gray-800/50" />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}