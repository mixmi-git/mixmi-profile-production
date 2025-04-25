# Placeholder Content for Mixmi Profile

This repository contains placeholder content for the Mixmi profile application, including images and mock data.

## Folder Structure

```
/public
  /placeholders
    /profile     - Profile avatar image
    /spotlight   - Images for spotlight section
    /gallery     - Images and GIFs for gallery section
    /shop        - Images for shop products
  /js
    load-placeholder.js - Script to load placeholder data
  load-placeholders.html - Web page to load placeholder data
```

## Placeholder Data

All placeholder content is organized in the `placeholder-data.json` file with the following structure:

- **Profile**: Basic profile information including name, what you do, bio, and profile image
- **Social Links**: Links to social media platforms
- **Wallet Visibility Defaults**: Settings for wallet visibility
- **Spotlight Items**: Featured content items with images
- **Media**: Media links
- **Shop Items**: Products displayed in the shop section
- **Gallery Items**: Images/GIFs displayed in the gallery

## Image Naming Conventions

- Profile image: `profile-image.jpeg`
- Spotlight images: `spotlight-item-[n].jpeg` 
- Gallery images: `gallery-item-[n].gif`
- Shop product images: `product-[n].[extension]` (jpg, jpeg, png)

## Loading Placeholder Data

There are two ways to load the placeholder data into your profile:

### 1. Using the Web Interface

1. Run your development server
2. Navigate to `http://localhost:3000/load-placeholders.html` (or whatever your port is)
3. Click the "Load Placeholder Content" button
4. Refresh the main profile page to see the changes

### 2. Using the Browser Console

1. Open your browser console on the profile page
2. Run:
```javascript
// First, make sure the script is loaded
const script = document.createElement('script');
script.src = '/js/load-placeholder.js';
document.head.appendChild(script);

// Wait a moment for the script to load, then:
setTimeout(() => {
  loadPlaceholderData();
  // Refresh the page to see changes
  window.location.reload();
}, 500);
```

## Profile Summary

- **Profile Name**: FluFFy Toy CoLLecTive
- **What You Do**: House Party Fluffy Crew

The content is structured to demonstrate all features of the profile interface while being easily replaceable with real content. 