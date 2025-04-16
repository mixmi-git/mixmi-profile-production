"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ToastProvider } from "@/contexts/ToastContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <ProfileProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ProfileProvider>
      </AuthProvider>
    </DndProvider>
  );
} 