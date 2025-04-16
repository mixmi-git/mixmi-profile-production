"use client";

import React from "react";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

export default function ProfileHeader() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  
  return (
    <div className="mb-10 bg-slate-900 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <ProfileImage />
        <ProfileInfo />
      </div>
      
      {isAuthenticated && (
        <div className="mt-6 flex justify-end">
          <button className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
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
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Edit Profile</span>
          </button>
        </div>
      )}
    </div>
  );
} 