"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/Button";

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
        <Button
          onClick={isAuthenticated ? disconnectWallet : connectWallet}
          variant="secondary"
          className="border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          {isAuthenticated ? 'Disconnect Wallet' : 'Connect Wallet'}
        </Button>
      </div>
    </header>
  );
} 