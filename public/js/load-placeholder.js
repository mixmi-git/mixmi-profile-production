// Browser-friendly script to load placeholder data into localStorage
// This can be run directly in the browser

(function() {
  // Simple UUID generator for browser use
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Placeholder data from our JSON file
  const placeholderData = {
    "profile": {
      "name": "FluFFy Toy CoLLecTive",
      "whatYouDo": "House Party Fluffy Crew",
      "bio": "All this stuff is just placeholder content. This is now YOUR page to customize.  **** But for fun, here's the story: Fluffy Toy Collective is a collective of fluffy frens that make music and pineapple art. Let them ruin your reputation with your neighbors as they bring noise and exploding snacks to your house. Then call your lawyer :))) ****"
    },
    "socialLinks": [
      {
        "platform": "X (twitter)",
        "url": "https://x.com/mixmi_remix"
      },
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/@mixmi_remix"
      }
    ],
    "walletVisibilityDefaults": false,
    "spotlightItems": [
      {
        "title": "The Band",
        "description": "Bringing the noise",
        "url": "https://docs.google.com/document/d/1y-ZK_ZhkNFanwqBJ5Aqk-Gog62pVRraZf-hvQUbrwwU/edit?usp=sharing",
        "image": "/placeholders/spotlight/spotlight-item-1.jpeg"
      },
      {
        "title": "The Selecta",
        "description": "Fluffy riddims",
        "url": "https://docs.google.com/document/d/1Kf_3ZtxoeX_gzmxIcaLz70izOdo5kLLdZrnLQlWHZww/edit?usp=sharing",
        "image": "/placeholders/spotlight/spotlight-item-2.jpeg"
      },
      {
        "title": "The Selecta",
        "description": "Fluffy riddims",
        "url": "https://docs.google.com/document/d/1jle4_X3L4bARJwH-ycnQxGG4MZjgcqnbKnFRuuR1TOI/edit?usp=sharing",
        "image": "/placeholders/spotlight/spotlight-item-3.jpeg"
      }
    ],
    "media": [
      {
        "url": "https://youtu.be/coh2TB6B2EA?si=fSqm0UOmE5gwBnRM"
      },
      {
        "url": ""
      }
    ],
    "shopItems": [
      {
        "title": "Blue's Rare Vinyl",
        "description": "I got your tunes",
        "image": "/placeholders/shop/product-1.jpeg",
        "url": ""
      },
      {
        "title": "Collectible stickers",
        "description": "Make your laptop feel ugly",
        "image": "/placeholders/shop/product-2.png",
        "url": "https://docs.google.com/document/d/1kJ1C5nZRYoeu2KJeAaC9sLclufG0-Egq3sGcTAy3SnE/edit?usp=sharing"
      },
      {
        "title": "The Remixes",
        "description": "Make your laptop feel ugly",
        "image": "/placeholders/shop/product-3.jpg",
        "url": ""
      }
    ],
    "galleryItems": [
      {
        "image": "/placeholders/gallery/gallery-item-1.gif"
      },
      {
        "image": "/placeholders/gallery/gallery-item-2.gif"
      },
      {
        "image": "/placeholders/gallery/gallery-item-3.gif"
      }
    ]
  };

  // Format profile data
  const profileData = {
    id: generateUUID(),
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
    id: generateUUID(),
    title: item.title,
    description: item.description,
    image: item.image,
    link: item.url,
  }));

  // Format media items
  const mediaItems = placeholderData.media
    .filter(item => item.url) // Filter out empty URLs
    .map(item => ({
      id: generateUUID(),
      type: 'youtube', // Assuming YouTube for now
      rawUrl: item.url,
      embedUrl: item.url.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')
    }));

  // Format shop items
  const shopItems = placeholderData.shopItems.map(item => ({
    id: generateUUID(),
    title: item.title,
    description: item.description,
    image: item.image,
    link: item.url || ''
  }));

  // Format gallery items
  const galleryItems = placeholderData.galleryItems.map(item => ({
    id: generateUUID(),
    image: item.image,
    createdAt: new Date().toISOString()
  }));

  // Function to load data into localStorage
  function loadPlaceholderData() {
    // Clear existing data
    localStorage.removeItem('profile');
    localStorage.removeItem('spotlight');
    localStorage.removeItem('media');
    localStorage.removeItem('shop');
    localStorage.removeItem('gallery');
    
    // Store data in localStorage
    localStorage.setItem('profile', JSON.stringify(profileData));
    localStorage.setItem('spotlight', JSON.stringify(spotlightItems));
    localStorage.setItem('media', JSON.stringify(mediaItems));
    localStorage.setItem('shop', JSON.stringify(shopItems));
    localStorage.setItem('gallery', JSON.stringify(galleryItems));
    
    console.log('Placeholder data loaded successfully!');
    console.log('Refresh the page to see changes.');
    
    return {
      profile: profileData,
      spotlight: spotlightItems,
      media: mediaItems,
      shop: shopItems,
      gallery: galleryItems
    };
  }

  // Make the function available globally
  window.loadPlaceholderData = loadPlaceholderData;
})(); 