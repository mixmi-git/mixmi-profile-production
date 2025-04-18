"use client";

import React, { useState } from "react";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import EditProfileModal from "./EditProfileModalNew";
import WalletSettingsModal from "../modals/WalletSettingsModal";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import EditButton from "../ui/EditButton";

export default function ProfileHeader() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
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
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="bg-background border border-accent text-accent px-4 py-2 rounded-md flex items-center space-x-2 transition-colors hover:bg-opacity-80"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                <line x1="21" y1="12" x2="3" y2="12"></line>
              </svg>
              <span>Wallet Settings</span>
            </button>
            
            <div className="flex items-center">
              <EditButton 
                size="md" 
                label="Edit Profile" 
                onClick={() => setIsEditModalOpen(true)}
                className="mr-2"
              />
              <span className="text-accent">Edit Profile</span>
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
        </>
      )}
    </div>
  );
} 