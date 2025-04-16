"use client";

import React from 'react';
import Image from 'next/image';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { getStickerById, DEFAULT_STICKER } from '@/lib/stickers';

export default function StickerDisplay() {
  const { profile, updateProfile } = useProfile();
  const { isAuthenticated } = useAuth();
  
  // Use default sticker if none is selected or if the selected one isn't found
  const selectedSticker = profile.sticker?.id ? getStickerById(profile.sticker.id) : null;
  const sticker = selectedSticker || DEFAULT_STICKER;
  
  return (
    <section className="mb-16 relative flex flex-col items-center">
      <div className="flex justify-end w-full mb-4">
        {isAuthenticated && (
          <button className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1 rounded-md flex items-center space-x-2 transition-colors text-sm">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Edit Sticker</span>
          </button>
        )}
      </div>
      
      <div className="max-w-xs">
        <Image 
          src={sticker.src} 
          alt={sticker.alt} 
          width={300}
          height={300}
          className="object-contain"
        />
      </div>
    </section>
  );
} 