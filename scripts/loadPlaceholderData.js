// Script to load placeholder data into localStorage
// This can be run in the browser console to populate the app with placeholder content

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Read the placeholder data file
const placeholderData = require('../placeholder-data.json');

// Format profile data
const profileData = {
  id: uuidv4(),
  name: placeholderData.profile.name,
  title: placeholderData.profile.whatYouDo,
  bio: placeholderData.profile.bio,
  image: "", // No profile image provided
  socialLinks: placeholderData.socialLinks.map(link => ({
    platform: link.platform.toLowerCase().replace(/\s*\(.*\)/, ''), // Clean platform name (e.g., "X (twitter)" -> "x")
    url: link.url
  })),
  sectionVisibility: {
    spotlight: true,
    media: true,
    shop: true,
    gallery: true,
    sticker: true
  },
  sectionTitles: {
    spotlight: "Spotlight",
    media: "Media",
    shop: "Shop",
    gallery: "Gallery",
    sticker: "Sticker"
  },
  showWalletAddress: !placeholderData.walletVisibilityDefaults,
  showBtcAddress: !placeholderData.walletVisibilityDefaults,
  sticker: {
    id: "daisy-blue",
    visible: true
  }
};

// Format spotlight items
const spotlightItems = placeholderData.spotlightItems.map(item => ({
  id: uuidv4(),
  title: item.title,
  description: item.description,
  image: item.image,
  link: item.url,
}));

// Format media items
const mediaItems = placeholderData.media
  .filter(item => item.url) // Filter out empty URLs
  .map(item => ({
    id: uuidv4(),
    type: 'youtube', // Assuming YouTube for now
    rawUrl: item.url,
    embedUrl: item.url.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')
  }));

// Format shop items
const shopItems = placeholderData.shopItems.map(item => ({
  id: uuidv4(),
  title: item.title,
  description: item.description,
  image: item.image,
  link: item.url || ''
}));

// Format gallery items
const galleryItems = placeholderData.galleryItems.map(item => ({
  id: uuidv4(),
  image: item.image,
  createdAt: new Date().toISOString()
}));

// Export a function that loads the data into localStorage when run in the browser
function loadPlaceholderData() {
  // Store data in localStorage
  localStorage.setItem('profile', JSON.stringify(profileData));
  localStorage.setItem('spotlight', JSON.stringify(spotlightItems));
  localStorage.setItem('media', JSON.stringify(mediaItems));
  localStorage.setItem('shop', JSON.stringify(shopItems));
  localStorage.setItem('gallery', JSON.stringify(galleryItems));
  
  console.log('Placeholder data loaded successfully!');
  console.log('Refresh the page to see changes.');
}

// In a browser environment, make the function available globally
if (typeof window !== 'undefined') {
  window.loadPlaceholderData = loadPlaceholderData;
}

// Export for Node.js environment
module.exports = {
  profileData,
  spotlightItems,
  mediaItems,
  shopItems,
  galleryItems,
  loadPlaceholderData
}; 