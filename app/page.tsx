"use client";

import ProfileLayout from "@/components/layout/ProfileLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  return (
    <ProfileLayout>
      <ProfileHeader />
      
      {!isAuthenticated && (
        <div className="text-center mt-12">
          <p className="text-lg text-gray-400 mb-8">
            Connect your wallet to edit your profile and manage sections
          </p>
        </div>
      )}
    </ProfileLayout>
  );
}
