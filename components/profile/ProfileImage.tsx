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
      <div className="relative w-80 h-80 mx-auto md:mx-0">
        <div 
          className={`w-full h-full rounded-lg border border-[#81E4F2] overflow-hidden ${
            isAuthenticated ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
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
                sizes="320px"
              />
            ) : (
              <div className="w-full h-full bg-[#151C2A] flex items-center justify-center">
                <span className="text-3xl text-gray-500">
                  {isAuthenticated ? "+" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="absolute bottom-2 right-2">
            <EditButton 
              size="md" 
              label="Edit Profile Image" 
              onClick={handleEditClick}
              className="shadow-md" 
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