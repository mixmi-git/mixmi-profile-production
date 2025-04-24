import { PenIcon } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

interface EditButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  onClick?: () => void;
}

export default function EditButton({ 
  size = 'md', 
  label = 'Edit', 
  className = '', 
  ...props 
}: EditButtonProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 22
  };
  
  return (
    <button
      type="button"
      className={`
        rounded-full border border-accent bg-background flex items-center justify-center
        transition-all hover:bg-[rgba(20,30,50,0.85)] focus:outline-none focus:ring-2 focus:ring-accent/50
        ${sizeClasses[size]} ${className}
      `}
      aria-label={label}
      title={label}
      {...props}
    >
      <PenIcon size={iconSizes[size]} className="text-accent" />
    </button>
  );
} 