"use client";

import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import ProfileImageModal from "./ProfileImageModal";
import EditButton from "../ui/EditButton";

export default function ProfileImage() {
  const { profile } = useProfile();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handle clicks on the profile image or edit button
  const handleEditClick = () => {
    if (!isAuthenticated) return;
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div className="relative w-[400px] h-[400px] mx-auto">
        <div 
          className={`w-full h-full rounded-lg border-4 border-accent overflow-hidden ${
            isAuthenticated ? "cursor-pointer" : ""
          }`}
          onClick={isAuthenticated ? handleEditClick : undefined}
        >
          <div className="relative w-full h-full">
            {profile.image ? (
              <Image 
                src={profile.image} 
                alt={profile.name || "Profile"} 
                fill
                className="object-cover rounded-[6px]"
                sizes="400px"
              />
            ) : (
              <div className="w-full h-full bg-[#151C2A] flex items-center justify-center">
                {isAuthenticated && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-12 h-12 text-gray-500"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="absolute bottom-4 right-4">
            <EditButton 
              size="md" 
              label="Edit Profile Image" 
              onClick={handleEditClick}
            />
          </div>
        )}
      </div>
      
      <ProfileImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentImage={profile.image}
      />
    </>
  );
} 