"use client";

import React from 'react';
import { useProfile } from '@/contexts/ProfileContext';

export default function SectionManager() {
  const { profile, updateProfile } = useProfile();
  
  const toggleSection = (section: keyof typeof profile.sectionVisibility) => {
    updateProfile({
      sectionVisibility: {
        ...profile.sectionVisibility,
        [section]: !profile.sectionVisibility[section]
      }
    });
  };
  
  const sections = [
    { key: 'spotlight', label: 'Spotlight' },
    { key: 'media', label: 'Media' },
    { key: 'shop', label: 'Shop' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'sticker', label: 'Sticker' }
  ] as const;
  
  return (
    <div className="mb-16 flex justify-center">
      <div className="bg-background border border-gray-800 rounded-lg p-5 inline-block">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Section Visibility</h3>
        
        <div className="flex flex-col space-y-2">
          {sections.map((section) => (
            <label
              key={section.key}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div 
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  profile.sectionVisibility[section.key] 
                    ? 'bg-accent' 
                    : 'bg-gray-700'
                }`}
                onClick={() => toggleSection(section.key)}
              >
                <div 
                  className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                    profile.sectionVisibility[section.key] 
                      ? 'bg-white left-[1.35rem]' 
                      : 'bg-gray-400 left-0.5'
                  }`}
                />
              </div>
              <span className={`text-sm ${
                profile.sectionVisibility[section.key]
                  ? 'text-white'
                  : 'text-gray-400'
              }`}>
                {section.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
} 