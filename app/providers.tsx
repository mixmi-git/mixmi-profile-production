"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ToastProvider } from "@/contexts/ToastContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ProfileProvider>
    </AuthProvider>
  );
} 