"use client";

import React, { useState } from "react";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import EditProfileModal from "./EditProfileModalNew";
import WalletSettingsModal from "../modals/WalletSettingsModal";
import SocialLinksModal from "../modals/SocialLinksModal";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import EditButton from "../ui/EditButton";

export default function ProfileHeader() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSocialLinksModalOpen, setIsSocialLinksModalOpen] = useState(false);
  
  return (
    <div className="mb-10 border border-border rounded-lg shadow-lg p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="md:w-1/3">
          <ProfileImage />
        </div>
        <div className="md:w-2/3">
          <ProfileInfo />
        </div>
      </div>
      
      {isAuthenticated && (
        <>
          <div className="mt-6 flex justify-end gap-4 max-w-[480px] ml-auto">
            <div className="flex items-center">
              <EditButton 
                size="sm" 
                label="Edit Social Links" 
                onClick={() => setIsSocialLinksModalOpen(true)}
                className="mr-2"
              />
              <span className="text-gray-400 text-sm">Social Links</span>
            </div>
            
            <div className="flex items-center">
              <EditButton 
                size="sm" 
                label="Wallet Settings" 
                onClick={() => setIsWalletModalOpen(true)}
                className="mr-2"
              />
              <span className="text-gray-400 text-sm">Wallet Settings</span>
            </div>
            
            <div className="flex items-center">
              <EditButton 
                size="sm" 
                label="Edit Profile" 
                onClick={() => setIsEditModalOpen(true)}
                className="mr-2"
              />
              <span className="text-gray-400 text-sm">Edit Profile</span>
            </div>
          </div>
          
          <EditProfileModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
          />
          
          <WalletSettingsModal
            isOpen={isWalletModalOpen}
            onClose={() => setIsWalletModalOpen(false)}
          />
          
          <SocialLinksModal
            isOpen={isSocialLinksModalOpen}
            onClose={() => setIsSocialLinksModalOpen(false)}
          />
        </>
      )}
    </div>
  );
} 