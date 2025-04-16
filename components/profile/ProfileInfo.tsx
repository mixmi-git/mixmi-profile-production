"use client";

import React from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileInfo() {
  const { profile } = useProfile();
  const { isAuthenticated, walletAddress, btcAddress } = useAuth();
  
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h1 className="text-4xl font-bold text-cyan-400">{profile.name || "Add Your Name"}</h1>
        <h2 className="text-xl text-gray-400">{profile.title || "Add Your Title"}</h2>
      </div>
      
      <div className="text-gray-300">
        <p>{profile.bio || "Tell us about yourself..."}</p>
      </div>
      
      {/* Social links would go here */}
      <div className="flex space-x-4">
        {profile.socialLinks && profile.socialLinks.map((link, index) => (
          <a 
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan-400"
          >
            {/* Icon would go here */}
            <span className="sr-only">{link.platform}</span>
          </a>
        ))}
      </div>
      
      {/* Wallet addresses */}
      {isAuthenticated && (
        <div className="space-y-2">
          {walletAddress && profile.showWalletAddress && (
            <div className="bg-slate-900 p-2 rounded-md flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">STX:</span>
                <span className="ml-2 text-sm">{`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}</span>
              </div>
              <button className="text-cyan-400 hover:text-cyan-300">
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
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          )}
          
          {btcAddress && profile.showBtcAddress && (
            <div className="bg-slate-900 p-2 rounded-md flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">BTC:</span>
                <span className="ml-2 text-sm">{`${btcAddress.slice(0, 8)}...${btcAddress.slice(-8)}`}</span>
              </div>
              <button className="text-cyan-400 hover:text-cyan-300">
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
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 