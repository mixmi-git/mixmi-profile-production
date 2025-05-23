"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';

export default function SectionManager() {
  const { profile, updateProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // State to store the exact width of the button
  const [buttonWidth, setButtonWidth] = useState(0);
  
  // Update button width when it changes
  useEffect(() => {
    if (buttonRef.current) {
      const updateWidth = () => {
        const width = buttonRef.current?.offsetWidth || 0;
        setButtonWidth(width);
      };
      
      // Initial measurement
      updateWidth();
      
      // Update on window resize
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);
  
  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
      <div ref={dropdownRef} className="relative">
        {/* Dropdown Button - Styled like Edit Section buttons */}
        <button 
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-800 hover:bg-slate-700 text-accent px-3 py-1 rounded-md flex items-center space-x-2 transition-colors text-sm"
        >
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
            <path d="M9 3H5a2 2 0 0 0-2 2v4"></path>
            <path d="M9 21H5a2 2 0 0 1-2-2v-4"></path>
            <path d="M19 3h-4"></path>
            <path d="M19 21h-4"></path>
            <path d="M21 9V5a2 2 0 0 0-2-2"></path>
            <path d="M21 19v-4a2 2 0 0 1-2-2"></path>
            <path d="M3 9v6"></path>
            <path d="M21 9v6"></path>
          </svg>
          <span>Show/Hide Sections</span>
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
            className={`transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        
        {/* Dropdown Content */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-2 z-10 bg-[#0a0f16] border border-[#1e293b] rounded-lg py-3 shadow-xl"
            style={{ width: buttonWidth > 0 ? `${buttonWidth}px` : 'auto' }}
          >
            <div className="flex flex-col space-y-2 px-3">
              {sections.map((section) => (
                <label
                  key={section.key}
                  className="flex items-center justify-between cursor-pointer rounded-md p-1 hover:bg-[#1a2436] transition-colors"
                >
                  <span className={`text-sm font-medium ${
                    profile.sectionVisibility[section.key]
                      ? 'text-white'
                      : 'text-gray-400'
                  }`}>
                    {section.label}
                  </span>
                  <div 
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      profile.sectionVisibility[section.key] 
                        ? 'bg-accent' 
                        : 'bg-gray-700'
                    }`}
                    onClick={() => toggleSection(section.key)}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                        profile.sectionVisibility[section.key] 
                          ? 'bg-white left-5' 
                          : 'bg-gray-400 left-1'
                      }`}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 