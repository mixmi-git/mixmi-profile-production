import { Sticker, StickerId } from '@/types';

export const stickers: Sticker[] = [
  {
    id: 'daisy-purple',
    imageUrl: '/stickers/daisy-purple.png',
    alt: 'Purple daisy'
  },
  {
    id: 'daisy-pink',
    imageUrl: '/stickers/daisy-pink.png',
    alt: 'Pink daisy'
  },
  {
    id: 'daisy-yellow',
    imageUrl: '/stickers/daisy-yellow.png',
    alt: 'Yellow daisy'
  },
  {
    id: 'daisy-white',
    imageUrl: '/stickers/daisy-white.png',
    alt: 'White daisy'
  },
  {
    id: 'daisy-blue',
    imageUrl: '/stickers/daisy-blue.png',
    alt: 'Blue daisy'
  },
  {
    id: 'moto-wheel-2',
    imageUrl: '/stickers/moto-wheel-2.png',
    alt: 'Mechanical wheel'
  },
  {
    id: 'gear-shiny',
    imageUrl: '/stickers/gear-shiny.png',
    alt: 'Shiny gear'
  },
  {
    id: 'lemon-slice',
    imageUrl: '/stickers/lemon-slice.png',
    alt: 'Lemon slice'
  },
  {
    id: 'lime-slice',
    imageUrl: '/stickers/lime-slice.png',
    alt: 'Lime slice'
  },
  {
    id: 'orange-slice',
    imageUrl: '/stickers/orange-slice.png',
    alt: 'Orange slice'
  },
  {
    id: 'pineapple-slice',
    imageUrl: '/stickers/pineapple-slice.png',
    alt: 'Pineapple slice'
  },
  {
    id: 'strawberry-slice',
    imageUrl: '/stickers/strawberry-slice.png',
    alt: 'Strawberry slice'
  },
];

export function getStickerById(id: StickerId): Sticker | undefined {
  return stickers.find(sticker => sticker.id === id);
} 