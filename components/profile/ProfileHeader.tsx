"use client";

import React, { useState } from "react";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import UnifiedProfileModal from "./UnifiedProfileModal";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

export default function ProfileHeader() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  return (
    <div className="mb-16 border border-border rounded-lg shadow-lg p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-16">
        <div className="self-center md:self-auto">
          <ProfileImage />
        </div>
        <div className="flex flex-col md:self-center">
          <div className="flex flex-col items-center text-center max-w-[400px]">
            <ProfileInfo />
            
            {isAuthenticated && (
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => setIsProfileModalOpen(true)}
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
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isAuthenticated && (
        <UnifiedProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      )}
    </div>
  );
} 