"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses = "rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 inline-flex items-center justify-center";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };
  
  const variantClasses = {
    primary: "bg-[#81E4F2] hover:bg-[#65d5e3] text-[#101726] focus:ring-[#81E4F2]",
    secondary: "bg-[#151C2A] hover:bg-[#1a2436] text-gray-200 border border-[#1E293B] focus:ring-gray-600",
    outline: "bg-transparent border border-[#81E4F2] text-[#81E4F2] hover:bg-[#81E4F2]/10 focus:ring-[#81E4F2]",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-700"
  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}; 