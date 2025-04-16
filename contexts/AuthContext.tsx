"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { StorageService } from "@/lib/storage";
import { STORAGE_KEYS } from "@/types";

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

// Create a new AppConfig with the proper permissions
const appConfig = new AppConfig(['store_write']);
// Create a UserSession with the AppConfig
const userSession = new UserSession({ appConfig });

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    walletAddress: null as string | null,
    btcAddress: null as string | null
  });
  
  // Load auth state from storage and check if user is already signed in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if user is already signed in
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        
        setAuth({
          isAuthenticated: true,
          walletAddress: userData.profile.stxAddress?.mainnet || null,
          btcAddress: userData.profile.btcAddress?.p2wpkh?.mainnet || null
        });
      } else {
        // Load from our own storage as fallback
        const storedAuth = StorageService.getItem(STORAGE_KEYS.AUTH, defaultAuthState);
        setAuth(storedAuth);
      }
    }
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
      icon: window.location.origin + "/favicon.ico",
    };
    
    showConnect({
      appDetails,
      redirectTo: '/',
      userSession,
      onFinish: () => {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          
          setAuth({
            isAuthenticated: true,
            walletAddress: userData.profile.stxAddress?.mainnet || null,
            btcAddress: userData.profile.btcAddress?.p2wpkh?.mainnet || null
          });
        }
      },
      onCancel: () => {
        console.log("Wallet connection canceled");
      }
    });
  };
  
  const disconnectWallet = () => {
    if (userSession.isUserSignedIn()) {
      userSession.signUserOut();
    }
    
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