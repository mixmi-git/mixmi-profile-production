"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Header() {
  const { isAuthenticated, connectWallet, disconnectWallet } = useAuth();

  return (
    <header className="bg-slate-900 py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
      <Link href="/" className="text-2xl font-bold text-cyan-400">
        mixmi
      </Link>
      
      <div>
        {isAuthenticated ? (
          <button
            onClick={disconnectWallet}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
} 