"use client";

import React from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function ProfileInfo() {
  const { profile } = useProfile();
  const { isAuthenticated, walletAddress, btcAddress } = useAuth();
  const { showToast } = useToast();
  
  // Helper to get appropriate social icon
  const getSocialIcon = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'twitter':
      case 'x':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="4" y1="4" x2="20" y2="20"></line>
            <line x1="20" y1="4" x2="4" y2="20"></line>
          </svg>
        );
      case 'instagram':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      case 'youtube':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
          </svg>
        );
      case 'spotify':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14.5c2.5-1 5.5-1 8 0"></path>
            <path d="M6.5 12c3.5-1 7.5-1 11 0"></path>
            <path d="M5 9.5c4-1 8-1 12 0"></path>
          </svg>
        );
      case 'tiktok':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
            <path d="M15 8h.01"></path>
            <path d="M21 12c-3 0-6-1-8-2.5V17a5 5 0 0 1-9.9 1H14V7c1 0 3 1 6 1z"></path>
          </svg>
        );
      case 'github':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        );
      case 'soundcloud':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M2 12h1v4h-1z"></path>
            <path d="M6 8v8h-1V8z"></path>
            <path d="M10 6v10H9V6z"></path>
            <path d="M14 6v10h-1V6z"></path>
            <path d="M18 8v8h-1V8z"></path>
            <path d="M22 8v8h-1V8z"></path>
          </svg>
        );
      default:
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
    }
  };
  
  // Function to handle wallet address copy
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Address copied to clipboard", "success", 2000);
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h1 className="text-4xl font-bold text-cyan-400">{profile.name || "Add Your Name"}</h1>
        <h2 className="text-xl text-gray-400">{profile.title || "Add Your Title"}</h2>
      </div>
      
      <div className="text-gray-300">
        <p>{profile.bio || "Tell us about yourself..."}</p>
      </div>
      
      {/* Social links */}
      <div className="flex space-x-6">
        {profile.socialLinks && profile.socialLinks.length > 0 ? (
          profile.socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
              title={link.platform}
            >
              {getSocialIcon(link.platform)}
              <span className="sr-only">{link.platform}</span>
            </a>
          ))
        ) : isAuthenticated ? (
          <button 
            className="text-gray-500 hover:text-cyan-400 transition-colors"
            onClick={() => console.log('Add social links')}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span className="sr-only">Add social links</span>
          </button>
        ) : null}
      </div>
      
      {/* Wallet addresses - Show based on profile settings */}
      <div className="space-y-2 mt-2">
        {walletAddress && profile.showWalletAddress && (
          <div className="bg-slate-900 p-2 rounded-md flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">STX:</span>
              <span className="ml-2 text-sm">{`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}</span>
            </div>
            <button 
              className="text-cyan-400 hover:text-cyan-300"
              onClick={() => copyToClipboard(walletAddress)}
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
            <button 
              className="text-cyan-400 hover:text-cyan-300"
              onClick={() => copyToClipboard(btcAddress)}
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
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 