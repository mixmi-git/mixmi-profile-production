import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";

interface WalletSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletSettingsModal({ isOpen, onClose }: WalletSettingsModalProps) {
  const { profile, updateProfile } = useProfile();
  const { walletAddress, btcAddress } = useAuth();
  
  const [showStx, setShowStx] = useState(profile.showWalletAddress);
  const [showBtc, setShowBtc] = useState(profile.showBtcAddress);

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log("WalletSettingsModal opened with:", {
        profileSettings: {
          showWalletAddress: profile.showWalletAddress,
          showBtcAddress: profile.showBtcAddress
        },
        availableAddresses: {
          stx: walletAddress,
          btc: btcAddress
        },
        formState: {
          showStx,
          showBtc
        }
      });
    }
  }, [isOpen, profile, walletAddress, btcAddress, showStx, showBtc]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowStx(profile.showWalletAddress);
      setShowBtc(profile.showBtcAddress);
    }
  }, [isOpen, profile]);

  const handleSave = () => {
    console.log("Saving wallet settings:", {
      showStx,
      showBtc
    });
    
    updateProfile({
      showWalletAddress: showStx,
      showBtcAddress: showBtc
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Wallet Settings">
      <div className="space-y-6">
        {/* Current wallet addresses */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-300">Connected Wallets</h3>
          
          {walletAddress ? (
            <div className="bg-slate-900 p-2 rounded-md flex items-center">
              <span className="text-xs text-gray-500">STX:</span>
              <span className="ml-2 text-sm">{`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No STX wallet connected</p>
          )}
          
          {btcAddress ? (
            <div className="bg-slate-900 p-2 rounded-md flex items-center">
              <span className="text-xs text-gray-500">BTC:</span>
              <span className="ml-2 text-sm">{`${btcAddress.slice(0, 8)}...${btcAddress.slice(-8)}`}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No BTC wallet connected</p>
          )}
        </div>

        {/* Visibility settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-300">Visibility Settings</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showStx"
              checked={showStx}
              onChange={(e) => setShowStx(e.target.checked)}
              className="h-4 w-4 bg-slate-800 border-slate-700 rounded text-cyan-600 focus:ring-cyan-500"
              disabled={!walletAddress}
            />
            <label htmlFor="showStx" className="ml-2 text-sm text-slate-300">
              Show STX wallet address on profile
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showBtc"
              checked={showBtc}
              onChange={(e) => setShowBtc(e.target.checked)}
              className="h-4 w-4 bg-slate-800 border-slate-700 rounded text-cyan-600 focus:ring-cyan-500"
              disabled={!btcAddress}
            />
            <label htmlFor="showBtc" className="ml-2 text-sm text-slate-300">
              Show BTC wallet address on profile
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-slate-700 rounded-md text-gray-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
} 