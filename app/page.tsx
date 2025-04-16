"use client";

import ProfileLayout from "@/components/layout/ProfileLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SectionManager from "@/components/profile/SectionManager";
import SpotlightSection from "@/components/sections/SpotlightSection";
import MediaSection from "@/components/sections/MediaSection";
import StickerDisplay from "@/components/sections/StickerDisplay";
import ShopSection from "@/components/sections/ShopSection";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  
  return (
    <ProfileLayout>
      <ProfileHeader />
      
      {isAuthenticated && (
        <SectionManager />
      )}
      
      {profile.sectionVisibility.spotlight && (
        <SpotlightSection />
      )}
      
      {profile.sectionVisibility.media && (
        <MediaSection />
      )}
      
      {profile.sectionVisibility.shop && (
        <ShopSection />
      )}
      
      {profile.sectionVisibility.sticker && (
        <StickerDisplay />
      )}
      
      {!isAuthenticated && 
       !profile.sectionVisibility.spotlight && 
       !profile.sectionVisibility.media && 
       !profile.sectionVisibility.shop && 
       !profile.sectionVisibility.sticker && (
        <div className="text-center mt-12">
          <p className="text-lg text-gray-400 mb-8">
            Connect your wallet to edit your profile and manage sections
          </p>
        </div>
      )}
    </ProfileLayout>
  );
}
