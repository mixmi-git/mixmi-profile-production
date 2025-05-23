"use client";

import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Instagram, Youtube, Music, Github, Twitch, Plus, Clipboard } from "lucide-react";
import { 
  FaSoundcloud, 
  FaMixcloud,
  FaTiktok,
  FaXTwitter
} from "react-icons/fa6";
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
        return <FaXTwitter size={20} />;
      case 'spotify':
        return <Music size={20} />;
      case 'github':
        return <Github size={20} />;
      case 'twitch':
        return <Twitch size={20} />;
      case 'soundcloud':
        return <FaSoundcloud size={20} />;
      case 'mixcloud':
        return <FaMixcloud size={20} />;
      case 'tiktok':
        return <FaTiktok size={20} />;
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
    <div className="flex flex-col items-center text-center">
      <h1 className="text-3xl font-medium text-accent mb-3" title={profile.name}>
        {nameText}
        {profile.name && profile.name.length > 40 ? "..." : ""}
      </h1>
      
      <p className="text-xl text-white/90 mb-4" title={profile.title}>
        {titleText}
        {profile.title && profile.title.length > 40 ? "..." : ""}
      </p>
      
      <p 
        className="text-gray-400 w-full mb-6 line-clamp-3 hover:line-clamp-none transition-all duration-200 cursor-default" 
        title={profile.bio && profile.bio.length > 350 ? profile.bio : undefined}
      >
        {bioText}
        {profile.bio && profile.bio.length > 350 ? "..." : ""}
      </p>
      
      {/* Social links */}
      {(socialLinks.length > 0 || isAuthenticated) && (
        <div className="flex justify-center gap-4 mb-6">
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
      
      {/* Wallet addresses */}
      {((profile.showWalletAddress && walletAddress) || (profile.showBtcAddress && btcAddress)) && (
        <div className="flex flex-col items-center gap-2 mb-8 max-w-[350px]">
          {profile.showWalletAddress && walletAddress && (
            <div className="bg-[#0f172a] py-2 px-4 rounded-md w-full border border-[#1e293b] flex items-center">
              <span className="text-xs text-gray-500 shrink-0 font-medium">STX:</span>
              <span className="text-xs text-gray-400 ml-2 truncate flex-1">{`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}</span>
              <button 
                className="text-gray-400 hover:text-[#81E4F2] ml-1 p-1 shrink-0 transition-colors"
                onClick={() => copyToClipboard(walletAddress)}
                title="Copy address"
              >
                <Clipboard size={14} />
              </button>
            </div>
          )}
          
          {profile.showBtcAddress && btcAddress && (
            <div className="bg-[#0f172a] py-2 px-4 rounded-md w-full border border-[#1e293b] flex items-center">
              <span className="text-xs text-gray-500 shrink-0 font-medium">BTC:</span>
              <span className="text-xs text-gray-400 ml-2 truncate flex-1">{`${btcAddress.slice(0, 8)}...${btcAddress.slice(-8)}`}</span>
              <button 
                className="text-gray-400 hover:text-[#81E4F2] ml-1 p-1 shrink-0 transition-colors"
                onClick={() => copyToClipboard(btcAddress)}
                title="Copy address"
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