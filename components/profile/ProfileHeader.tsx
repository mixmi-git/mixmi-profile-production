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
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="md:w-2/5">
          <ProfileImage />
        </div>
        <div className="md:w-3/5">
          <ProfileInfo />
          
          {isAuthenticated && (
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex items-center">
                <EditButton 
                  size="md" 
                  label="Edit Profile" 
                  onClick={() => setIsEditModalOpen(true)}
                  className="mr-2"
                />
                <span className="text-gray-400 text-sm">Profile</span>
              </div>
              
              <div className="flex items-center">
                <EditButton 
                  size="md" 
                  label="Edit Social Links" 
                  onClick={() => setIsSocialLinksModalOpen(true)}
                  className="mr-2"
                />
                <span className="text-gray-400 text-sm">Social</span>
              </div>
              
              <div className="flex items-center">
                <EditButton 
                  size="md" 
                  label="Wallet Settings" 
                  onClick={() => setIsWalletModalOpen(true)}
                  className="mr-2"
                />
                <span className="text-gray-400 text-sm">Wallet</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isAuthenticated && (
        <>
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