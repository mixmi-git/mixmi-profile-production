"use client";

import ProfileLayout from "@/components/layout/ProfileLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SectionManager from "@/components/profile/SectionManager";
import SpotlightSection from "@/components/sections/SpotlightSection";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  
  return (
    <ProfileLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 text-white rounded-xl p-6 md:p-10 shadow-xl mb-8">
          <ProfileHeader />
        </div>
        
        {isAuthenticated && (
          <SectionManager />
        )}
        
        {profile.sectionVisibility.spotlight && (
          <SpotlightSection />
        )}
        
        {!isAuthenticated && !profile.sectionVisibility.spotlight && (
          <div className="text-center mt-12">
            <p className="text-lg text-gray-400 mb-8">
              Connect your wallet to edit your profile and manage sections
            </p>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
