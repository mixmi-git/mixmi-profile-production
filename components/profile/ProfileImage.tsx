"use client";

import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function ProfileImage() {
  const { profile, updateProfile } = useProfile();
  const { isAuthenticated } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  // This would be replaced with an actual image upload component later
  const handleImageClick = () => {
    if (!isAuthenticated) return;
    
    // For now, use a placeholder image
    updateProfile({
      image: profile.image || "https://placekitten.com/300/300"
    });
  };
  
  return (
    <div className="relative w-64 h-64 mx-auto md:mx-0">
      <div 
        className={`w-full h-full rounded-lg overflow-hidden border-2 border-accent ${
          isAuthenticated ? "cursor-pointer hover:opacity-90" : ""
        }`}
        onClick={isAuthenticated ? handleImageClick : undefined}
      >
        {profile.image ? (
          <Image 
            src={profile.image} 
            alt={profile.name || "Profile"} 
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-background flex items-center justify-center">
            <span className="text-3xl text-slate-500">
              {isAuthenticated ? "+" : ""}
            </span>
          </div>
        )}
      </div>
      
      {isAuthenticated && (
        <div className="absolute bottom-2 right-2 bg-background rounded-full p-2 cursor-pointer hover:bg-opacity-80 border border-accent">
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
            className="text-accent"
          >
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </div>
      )}
    </div>
  );
} 