"use client";

import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Instagram, Youtube, SquareX, Music, Github, Twitch, Plus, Clipboard } from "lucide-react";
import SocialLinksModal from "../modals/SocialLinksModal";

export default function ProfileInfo() {
  const { profile } = useProfile();
  const { isAuthenticated, walletAddress, btcAddress } = useAuth();
  const { showToast } = useToast();
  const [isSocialLinksModalOpen, setIsSocialLinksModalOpen] = useState(false);
  
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
    <div className="flex flex-col space-y-4 text-center max-w-[420px] mx-auto">
      <div className="mb-2">
        <h1 className="text-[32px] font-medium text-[#81E4F2]" title={profile.name}>
          {nameText}
          {profile.name && profile.name.length > 40 ? "..." : ""}
        </h1>
        <h2 className="text-[20px] font-normal text-white/80 mt-1" title={profile.title}>
          {titleText}
          {profile.title && profile.title.length > 40 ? "..." : ""}
        </h2>
      </div>
      
      <div className="text-gray-300 text-[14px] font-normal mt-1 mb-5">
        <p 
          className="line-clamp-3 hover:line-clamp-none transition-all duration-200 cursor-default" 
          title={profile.bio && profile.bio.length > 350 ? profile.bio : undefined}
        >
          {bioText}
          {profile.bio && profile.bio.length > 350 ? "..." : ""}
        </p>
      </div>
      
      {/* Social links */}
      {(socialLinks.length > 0 || isAuthenticated) && (
        <div className="flex justify-center gap-6 my-4">
          {socialLinks.length > 0 ? (
            socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#81E4F2] transition-colors"
                title={link.platform}
              >
                {link.icon}
              </a>
            ))
          ) : isAuthenticated ? (
            <span className="text-gray-500 text-sm italic">No social links added</span>
          ) : null}
        </div>
      )}
      
      {/* Wallet addresses - compact style with reduced spacing */}
      {((profile.showWalletAddress && walletAddress) || (profile.showBtcAddress && btcAddress)) && (
        <div className="mt-3 flex flex-col items-center gap-1 max-w-xs mx-auto">
          {profile.showWalletAddress && walletAddress && (
            <div className="bg-[#151C2A] py-1.5 px-3 rounded-md w-full border border-[#1E293B] flex items-center">
              <span className="text-xs text-gray-500 shrink-0 font-medium">STX:</span>
              <span className="text-xs text-gray-400 ml-2 truncate">{`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}</span>
              <button 
                className="text-gray-400 hover:text-[#81E4F2] ml-auto p-0.5"
                onClick={() => copyToClipboard(walletAddress)}
              >
                <Clipboard size={14} />
              </button>
            </div>
          )}
          
          {profile.showBtcAddress && btcAddress && (
            <div className="bg-[#151C2A] py-1.5 px-3 rounded-md w-full border border-[#1E293B] flex items-center">
              <span className="text-xs text-gray-500 shrink-0 font-medium">BTC:</span>
              <span className="text-xs text-gray-400 ml-2 truncate">{`${btcAddress.slice(0, 8)}...${btcAddress.slice(-8)}`}</span>
              <button 
                className="text-gray-400 hover:text-[#81E4F2] ml-auto p-0.5"
                onClick={() => copyToClipboard(btcAddress)}
              >
                <Clipboard size={14} />
              </button>
            </div>
          )}
        </div>
      )}
      
      <SocialLinksModal
        isOpen={isSocialLinksModalOpen}
        onClose={() => setIsSocialLinksModalOpen(false)}
      />
    </div>
  );
} 