"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { STORAGE_KEYS } from "@/types";
import { StorageService } from "@/lib/storage";
import { showConnect } from "@stacks/connect";

type AuthContextType = {
  isAuthenticated: boolean;
  walletAddress: string | null;
  btcAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
};

const defaultAuthState = {
  isAuthenticated: false,
  walletAddress: null,
  btcAddress: null
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    walletAddress: null as string | null,
    btcAddress: null as string | null
  });
  
  // Load auth state from storage
  useEffect(() => {
    const storedAuth = StorageService.getItem(STORAGE_KEYS.AUTH, defaultAuthState);
    setAuth(storedAuth);
  }, []);
  
  // Save auth state to storage when it changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      StorageService.setItem(STORAGE_KEYS.AUTH, auth);
    }
  }, [auth]);
  
  const connectWallet = () => {
    const appDetails = {
      name: "Mixmi Profile",
      icon: window.location.origin + "/logo.png",
    };
    
    showConnect({
      appDetails,
      onFinish: (data) => {
        const { userSession } = data;
        const userData = userSession.loadUserData();
        
        setAuth({
          isAuthenticated: true,
          walletAddress: userData.profile.stxAddress.mainnet, // or testnet based on your needs
          btcAddress: userData.profile.btcAddress?.p2wpkh?.mainnet || null // Bitcoin address if available
        });
      },
      onCancel: () => {
        console.log("Wallet connection canceled");
      }
    });
  };
  
  const disconnectWallet = () => {
    setAuth({
      isAuthenticated: false,
      walletAddress: null,
      btcAddress: null
    });
    StorageService.removeItem(STORAGE_KEYS.AUTH);
  };
  
  return (
    <AuthContext.Provider value={{
      isAuthenticated: auth.isAuthenticated,
      walletAddress: auth.walletAddress,
      btcAddress: auth.btcAddress,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 