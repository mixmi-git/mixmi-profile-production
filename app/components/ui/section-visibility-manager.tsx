'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from './switch';
import { Label } from './label';

interface SectionVisibility {
  spotlight?: boolean;
  media?: boolean;
  shop?: boolean;
  sticker?: boolean;
}

interface SectionVisibilityManagerProps {
  visibility: SectionVisibility;
  onVisibilityChange: (field: keyof SectionVisibility, value: boolean) => void;
  isAuthenticated?: boolean;
  className?: string;
}

/**
 * SectionVisibilityManager component for controlling which sections are visible
 */
const SectionVisibilityManager = ({
  visibility,
  onVisibilityChange,
  isAuthenticated = true,
  className = '',
}: SectionVisibilityManagerProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Do not render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Ensure visibility object exists even if undefined
  const safeVisibility = visibility || {};

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handler for toggling visibility
  const handleToggle = (section: keyof SectionVisibility) => {
    onVisibilityChange(section, !(safeVisibility[section] ?? true));
  };

  // Helper function to render status indicator
  const renderStatus = (isVisible: boolean) => (
    <span className={`text-xs font-medium ml-2 ${isVisible ? 'text-cyan-400' : 'text-gray-500'}`}>
      {isVisible ? 'VISIBLE' : 'HIDDEN'}
    </span>
  );

  return (
    <Card className={cn('relative border border-gray-700 bg-gray-800 text-white', className)}>
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors rounded-t-lg"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <EyeOff size={16} className="text-gray-300" /> : <Eye size={16} className="text-gray-300" />}
          <h3 className="text-sm font-medium text-gray-200">Manage Sections</h3>
        </div>
        {isExpanded ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
      </div>

      {isExpanded && (
        <CardContent className="pt-4 bg-gray-800 text-white rounded-b-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Label htmlFor="toggle-spotlight" className="flex items-center cursor-pointer text-gray-200">
                  Spotlight Section
                </Label>
                {renderStatus(safeVisibility.spotlight ?? true)}
              </div>
              <Switch
                id="toggle-spotlight"
                checked={safeVisibility.spotlight ?? true}
                onCheckedChange={() => handleToggle('spotlight')}
                className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Label htmlFor="toggle-media" className="flex items-center cursor-pointer text-gray-200">
                  Media Section
                </Label>
                {renderStatus(safeVisibility.media ?? true)}
              </div>
              <Switch
                id="toggle-media"
                checked={safeVisibility.media ?? true}
                onCheckedChange={() => handleToggle('media')}
                className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Label htmlFor="toggle-shop" className="flex items-center cursor-pointer text-gray-200">
                  Shop Section
                </Label>
                {renderStatus(safeVisibility.shop ?? true)}
              </div>
              <Switch
                id="toggle-shop"
                checked={safeVisibility.shop ?? true}
                onCheckedChange={() => handleToggle('shop')}
                className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Label htmlFor="toggle-sticker" className="flex items-center cursor-pointer text-gray-200">
                  Sticker
                </Label>
                {renderStatus(safeVisibility.sticker ?? true)}
              </div>
              <Switch
                id="toggle-sticker"
                checked={safeVisibility.sticker ?? true}
                onCheckedChange={() => handleToggle('sticker')}
                className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export { SectionVisibilityManager }; 