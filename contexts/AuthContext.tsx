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
        
        // For development/testing: Use mock data
        if (process.env.NODE_ENV === 'development') {
          console.log("Using mock wallet data for development");
          
          // When in development, always set these test addresses for easier testing
          const mockAddresses = {
            isAuthenticated: true,
            walletAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
            btcAddress: '1AKHyiMrE5RRNjWCVhzqgCLYVV4AZMXsP'
          };
          
          setAuth(mockAddresses);
          
          // Also store in local storage for persistence between refreshes
          StorageService.setItem(STORAGE_KEYS.AUTH, mockAddresses);
        } else {
          setAuth(storedAuth);
        }
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
    try {
      const appDetails = {
        name: "Mixmi Profile",
        icon: window.location.origin + "/favicon.ico",
      };
      
      console.log("Connecting to wallet...");
      
      showConnect({
        appDetails,
        redirectTo: '/',
        userSession,
        onFinish: () => {
          console.log("Wallet connection finished");
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            console.log("User is signed in, data:", userData);
            
            // Extract addresses with fallbacks
            const stxAddress = userData.profile?.stxAddress?.mainnet || null;
            const btcAddress = userData.profile?.btcAddress?.p2wpkh?.mainnet || null;
            
            if (stxAddress) {
              setAuth({
                isAuthenticated: true,
                walletAddress: stxAddress,
                btcAddress: btcAddress
              });
              
              // Log for debugging
              console.log("Wallet addresses set:", {
                stx: stxAddress,
                btc: btcAddress
              });
            } else {
              console.error("No STX address found in user data");
            }
          } else {
            console.log("User session finished but not signed in");
          }
        },
        onCancel: () => {
          console.log("Wallet connection canceled");
        }
      });
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      
      // For testing/development: Use mock data if connection fails
      if (process.env.NODE_ENV === 'development') {
        console.log("Using mock wallet data for development");
        setAuth({
          isAuthenticated: true,
          walletAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
          btcAddress: '1AKHyiMrE5RRNjWCVhzqgCLYVV4AZMXsP'
        });
      }
    }
  };
  
  const disconnectWallet = () => {
    if (userSession.isUserSignedIn()) {
      userSession.signUserOut();
    }
    
    // In development mode, don't fully disconnect - use mock data for easier testing
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: Using mock data instead of fully disconnecting");
      const mockAddresses = {
        isAuthenticated: false, // Set to false to simulate logged out state
        walletAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
        btcAddress: '1AKHyiMrE5RRNjWCVhzqgCLYVV4AZMXsP'
      };
      setAuth(mockAddresses);
      StorageService.setItem(STORAGE_KEYS.AUTH, mockAddresses);
    } else {
      // In production, completely clear auth data
      setAuth({
        isAuthenticated: false,
        walletAddress: null,
        btcAddress: null
      });
      StorageService.removeItem(STORAGE_KEYS.AUTH);
    }
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