"use client";

import React, { useState } from "react";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import UnifiedProfileModal from "./UnifiedProfileModal";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import EditButton from "../ui/EditButton";

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
                <EditButton 
                  size="md" 
                  label="Edit Profile" 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="mr-2"
                />
                <span className="text-gray-400 text-sm ml-2 self-center">Edit your profile</span>
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