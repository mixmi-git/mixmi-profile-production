import { useState } from 'react';
import Image from 'next/image';
import { useProfile } from '@/contexts/ProfileContext';
import { StickerId } from '@/types';
import { stickers } from '@/lib/stickerData';
import Modal from '@/components/ui/Modal';

type StickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function StickerModal({ isOpen, onClose }: StickerModalProps) {
  const { profile, updateProfile } = useProfile();
  const [selectedStickerId, setSelectedStickerId] = useState<StickerId>(
    (profile.sticker.id as StickerId) || 'daisy-blue'
  );

  const handleStickerSelect = (id: StickerId) => {
    setSelectedStickerId(id);
  };

  const handleSave = () => {
    updateProfile({
      sticker: {
        ...profile.sticker,
        id: selectedStickerId
      }
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile Sticker">
      <div className="space-y-4">
        <p className="text-gray-500">
          Choose a daisy, fruit slice, or mechanical design for your profile
        </p>
        
        <div className="grid grid-cols-4 gap-4">
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              onClick={() => handleStickerSelect(sticker.id)}
              className={`
                relative aspect-square rounded-lg overflow-hidden cursor-pointer
                border-2 ${selectedStickerId === sticker.id ? 'border-cyan-500' : 'border-transparent'}
                bg-slate-900 flex items-center justify-center p-2
              `}
            >
              <Image
                src={sticker.imageUrl}
                alt={sticker.alt}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
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
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
} 