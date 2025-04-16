"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="bg-slate-950 text-white rounded-xl p-6 md:p-10 shadow-xl">
            {children}
          </div>
        </div>
      </ProfileProvider>
    </AuthProvider>
  );
} 