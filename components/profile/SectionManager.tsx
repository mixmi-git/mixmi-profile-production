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
    { key: 'sticker', label: 'Sticker' }
  ] as const;
  
  return (
    <div className="mb-16 flex justify-center">
      <div className="max-w-md bg-background border border-gray-800 rounded-lg p-4 inline-block">
        <h3 className="text-sm font-medium text-gray-400 mb-3 text-center">Show/Hide Sections</h3>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => toggleSection(section.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                profile.sectionVisibility[section.key]
                  ? 'bg-accent/10 text-accent border border-accent/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              {section.label}
              <span className="ml-1">
                {profile.sectionVisibility[section.key] ? '✓' : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 