"use client";

import React from 'react';
import Image from 'next/image';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { getStickerById, DEFAULT_STICKER } from '@/lib/stickers';

export default function StickerDisplay() {
  const { profile, updateProfile } = useProfile();
  const { isAuthenticated } = useAuth();
  
  const sticker = profile.sticker?.id ? getStickerById(profile.sticker.id) : undefined;
  
  if (!profile.sticker?.id && !isAuthenticated) {
    return null;
  }
  
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
        {sticker ? (
          <Image 
            src={sticker.src} 
            alt={sticker.alt} 
            width={300}
            height={300}
            className="object-contain"
          />
        ) : isAuthenticated ? (
          <div 
            className="border-2 border-dashed border-slate-700 rounded-md p-8 flex items-center justify-center cursor-pointer hover:border-slate-600 transition-colors w-60 h-60"
            onClick={() => {
              // When we have the edit modal, this will open it
              // For now, just select the default sticker
              updateProfile({
                sticker: {
                  id: DEFAULT_STICKER.id,
                  visible: true
                }
              });
            }}
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-cyan-400"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <p className="text-gray-400">Choose a Sticker</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
} 