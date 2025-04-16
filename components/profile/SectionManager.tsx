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
    { key: 'sticker', label: 'Sticker Pack' }
  ] as const;
  
  return (
    <div className="mb-10 bg-slate-900 p-4 rounded-md border border-slate-800">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Manage Sections</h3>
      
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => toggleSection(section.key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              profile.sectionVisibility[section.key]
                ? 'bg-cyan-800/30 text-cyan-400 border border-cyan-800'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
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
  );
} 