"use client";

import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Instagram, Youtube, SquareX, Music, Github, Twitch, Plus, Clipboard } from "lucide-react";

export default function ProfileInfo() {
  const { profile } = useProfile();
  const { isAuthenticated, walletAddress, btcAddress } = useAuth();
  const { showToast } = useToast();
  
  // Map social links to their icons
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram size={20} />;
      case 'youtube':
        return <Youtube size={20} />;
      case 'twitter':
        return <SquareX size={20} />;
      case 'spotify':
        return <Music size={20} />;
      case 'github':
        return <Github size={20} />;
      case 'twitch':
        return <Twitch size={20} />;
      default:
        return <Music size={20} />;
    }
  };
  
  // Function to handle wallet address copy
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Address copied to clipboard", "success", 2000);
  };
  
  // Filter and prepare social links
  const socialLinks = profile.socialLinks
    ? profile.socialLinks.map(link => ({
        icon: getSocialIcon(link.platform),
        url: link.url,
        platform: link.platform
      }))
    : [];
  
  // Truncate fields with character limits
  const nameText = (profile.name || "Add Your Name").slice(0, 40);
  const titleText = (profile.title || "Add Your Title").slice(0, 40);
  const bioText = (profile.bio || "Tell us about yourself...").slice(0, 350);
  
  return (
    <div className="flex flex-col space-y-4 text-center max-w-[480px] mx-auto">
      <div className="mb-2">
        <h1 className="text-4xl font-bold text-accent" title={profile.name}>
          {nameText}
          {profile.name && profile.name.length > 40 ? "..." : ""}
        </h1>
        <h2 className="text-xl text-gray-400 mt-1" title={profile.title}>
          {titleText}
          {profile.title && profile.title.length > 40 ? "..." : ""}
        </h2>
      </div>
      
      <div className="text-gray-300 text-sm mt-1 mb-5">
        <p 
          className="line-clamp-3 hover:line-clamp-none transition-all duration-200 cursor-default" 
          title={profile.bio && profile.bio.length > 350 ? profile.bio : undefined}
        >
          {bioText}
          {profile.bio && profile.bio.length > 350 ? "..." : ""}
        </p>
      </div>
      
      {/* Social links */}
      <div className="flex gap-6 justify-center my-5">
        {socialLinks.length > 0 ? (
          socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-100 transition-colors"
              title={link.platform}
            >
              {link.icon}
            </a>
          ))
        ) : isAuthenticated ? (
          <button 
            className="text-gray-500 hover:text-gray-400 transition-colors"
            onClick={() => console.log('Add social links')}
          >
            <Plus size={20} />
            <span className="sr-only">Add social links</span>
          </button>
        ) : null}
      </div>
      
      {/* Wallet addresses - completely simplified structure */}
      {((profile.showWalletAddress && walletAddress) || (profile.showBtcAddress && btcAddress)) && (
        <div className="mt-5 flex flex-col items-center gap-3 max-w-xs mx-auto">
          {profile.showWalletAddress && walletAddress && (
            <div className="bg-background py-2 px-3 rounded-md w-full border border-border flex items-center">
              <span className="text-xs text-gray-500 shrink-0">STX:</span>
              <span className="text-xs text-gray-400 ml-2 mr-6">{`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}</span>
              <button 
                className="text-gray-400 hover:text-gray-300 ml-auto"
                onClick={() => copyToClipboard(walletAddress)}
              >
                <Clipboard size={16} />
              </button>
            </div>
          )}
          
          {profile.showBtcAddress && btcAddress && (
            <div className="bg-background py-2 px-3 rounded-md w-full border border-border flex items-center">
              <span className="text-xs text-gray-500 shrink-0">BTC:</span>
              <span className="text-xs text-gray-400 ml-2 mr-6">{`${btcAddress.slice(0, 8)}...${btcAddress.slice(-8)}`}</span>
              <button 
                className="text-gray-400 hover:text-gray-300 ml-auto"
                onClick={() => copyToClipboard(btcAddress)}
              >
                <Clipboard size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 