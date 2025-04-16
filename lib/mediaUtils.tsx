import React from 'react';

// Media types we support
export type MediaType = 'youtube' | 'spotify' | 'soundcloud' | 'apple-music' | 'mixcloud' | 'other';

interface MediaInfo {
  type: MediaType;
  embedUrl: string;
  title?: string;
}

export function parseMediaUrl(url: string): MediaInfo | null {
  if (!url) return null;
  
  try {
    // Validate URL format
    new URL(url);
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        return {
          type: 'youtube',
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          title: `YouTube Video (${videoId})`
        };
      }
    }
    
    // Spotify
    if (url.includes('spotify.com')) {
      let embedPath = '';
      const parts = url.split('spotify.com/');
      
      if (parts.length > 1) {
        embedPath = parts[1].replace(/\?.*$/, '');
        return {
          type: 'spotify',
          embedUrl: `https://open.spotify.com/embed/${embedPath}`,
          title: 'Spotify'
        };
      }
    }
    
    // SoundCloud
    if (url.includes('soundcloud.com')) {
      return {
        type: 'soundcloud',
        embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`,
        title: 'SoundCloud'
      };
    }
    
    // Apple Music
    if (url.includes('music.apple.com')) {
      // Extract the embed path from Apple Music URL
      // Format: https://music.apple.com/us/album/album-name/id?i=song-id
      try {
        const cleanUrl = url.replace('https://music.apple.com/', '');
        return {
          type: 'apple-music',
          embedUrl: `https://embed.music.apple.com/${cleanUrl}`,
          title: 'Apple Music'
        };
      } catch (e) {
        console.error('Error parsing Apple Music URL:', e);
      }
    }
    
    // Mixcloud
    if (url.includes('mixcloud.com')) {
      try {
        // Format: https://www.mixcloud.com/username/showname/
        // Convert to: https://www.mixcloud.com/widget/iframe/?feed=/username/showname/
        const urlObj = new URL(url);
        const path = urlObj.pathname; // This will be like /username/showname/
        
        return {
          type: 'mixcloud',
          embedUrl: `https://www.mixcloud.com/widget/iframe/?feed=${path}&hide_cover=1`,
          title: 'Mixcloud'
        };
      } catch (e) {
        console.error('Error parsing Mixcloud URL:', e);
      }
    }
    
    // Default to original URL if no specific embedding is recognized
    return {
      type: 'other',
      embedUrl: url,
      title: 'Media Embed'
    };
  } catch (error) {
    console.error('Error parsing media URL:', error);
    return null;
  }
}

export function getMediaPreview(mediaType: MediaType, embedUrl: string): JSX.Element {
  switch (mediaType) {
    case 'youtube':
      return (
        <iframe
          src={embedUrl}
          width="100%"
          height="200"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video"
        />
      );
    case 'spotify':
      return (
        <iframe
          src={embedUrl}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
          title="Spotify Track"
        />
      );
    case 'soundcloud':
      return (
        <iframe
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          src={embedUrl}
          title="SoundCloud Track"
        />
      );
    case 'apple-music':
      return (
        <iframe
          src={embedUrl}
          width="100%"
          height="175"
          frameBorder="0"
          allow="autoplay *; encrypted-media *;"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          title="Apple Music"
        />
      );
    case 'mixcloud':
      return (
        <iframe
          width="100%"
          height="180"
          src={embedUrl}
          frameBorder="0"
          allow="autoplay"
          title="Mixcloud"
        />
      );
    default:
      return (
        <div className="bg-slate-800 p-4 flex items-center justify-center h-40 text-gray-400">
          External Media: {embedUrl}
        </div>
      );
  }
} 