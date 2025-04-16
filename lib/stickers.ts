export interface StickerOption {
  id: string;
  src: string;
  alt: string;
}

export const STICKERS: StickerOption[] = [
  {
    id: 'daisy-blue',
    src: '/stickers/daisy-blue.png',
    alt: 'Blue Daisy Sticker'
  }
  // More stickers will be added here later
];

// Helper function to get a sticker by ID
export const getStickerById = (id: string): StickerOption | undefined => {
  return STICKERS.find(sticker => sticker.id === id);
};

// Default sticker to use as placeholder
export const DEFAULT_STICKER: StickerOption = STICKERS[0]; 