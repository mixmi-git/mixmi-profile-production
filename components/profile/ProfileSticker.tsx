import { useState } from 'react';
import Image from 'next/image';
import { useProfile } from '@/contexts/ProfileContext';
import { getStickerById } from '@/lib/stickerData';
import StickerModal from '@/components/modals/StickerModal';

interface ProfileStickerProps {
  editable?: boolean;
}

export default function ProfileSticker({ editable = false }: ProfileStickerProps) {
  const { profile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!profile.sectionVisibility.sticker || !profile.sticker.visible) return null;
  
  const sticker = profile.sticker.id 
    ? getStickerById(profile.sticker.id as any) 
    : null;
  
  if (!sticker && !editable) return null;
  
  return (
    <>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <div className="relative">
          {sticker && (
            <Image
              src={sticker.imageUrl}
              alt={sticker.alt}
              width={100}
              height={100}
              className="animate-slow-spin"
            />
          )}
          
          {editable && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="absolute -top-2 -right-2 px-2 py-1 text-xs bg-slate-800 text-cyan-400 rounded-md border border-slate-700 hover:bg-slate-700"
            >
              Edit Sticker
            </button>
          )}
        </div>
      </div>
      
      <StickerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 