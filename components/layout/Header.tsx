"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { isAuthenticated, connectWallet, disconnectWallet } = useAuth();

  return (
    <header className="bg-background py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-10 border-b border-border">
      <Link href="/" className="flex items-center">
        <Image 
          src="/logos/logotype-mixmi.svg" 
          alt="Mixmi Logo" 
          width={100} 
          height={32} 
          priority
        />
      </Link>
      
      <div>
        {isAuthenticated ? (
          <button
            onClick={disconnectWallet}
            className="bg-background border border-accent text-accent px-4 py-2 rounded-md transition-colors hover:bg-opacity-80"
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-background border border-accent text-accent px-4 py-2 rounded-md transition-colors hover:bg-opacity-80"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
} 