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
      <section className="mb-16 py-8 flex justify-center">
        <div className="relative">
          {sticker && (
            <Image
              src={sticker.imageUrl}
              alt={sticker.alt}
              width={130}
              height={130}
              className="animate-slow-spin"
            />
          )}
          
          {editable && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="absolute -top-2 -right-2 bg-slate-800 hover:bg-slate-700 text-accent px-3 py-1 rounded-md flex items-center space-x-2 transition-colors text-sm"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span>Edit Sticker</span>
            </button>
          )}
        </div>
      </section>
      
      <StickerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 