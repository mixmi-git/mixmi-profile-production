"use client";

import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose: () => void;
}

export default function Toast({
  message,
  duration = 3000,
  type = 'success',
  visible,
  onClose
}: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);
  
  if (!visible) return null;
  
  const bgColor = type === 'success' ? 'bg-green-600' : 
                 type === 'error' ? 'bg-red-600' : 
                 'bg-blue-600';
  
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center justify-between`}>
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 text-white"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
} 