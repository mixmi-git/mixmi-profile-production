"use client";

import React from "react";
import Header from "./Header";

export default function ProfileLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        {children}
      </main>
    </div>
  );
} 