export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Mythic';

export type RewardType = 'Coins' | 'Keys' | 'Card' | 'RealReward';

export interface Reward {
  id: string;
  name: string;
  amount?: number;
  type: RewardType;
  rarity: Rarity;
  imageUrl?: string;
  icon?: string;
}

export type ChestTier = 'Bronze' | 'Silver' | 'Gold' | 'Mythic';

export interface ChestConfig {
  tier: ChestTier;
  cost: number;
  colorHex: string;
  glowColorHex: string;
}

export type ThemeType = 'dark' | 'light';

export interface UserState {
  keys: number;
  coins: number;
  level: number;
  streak: number;
  history: Reward[];
  coinAdsWatched: number;
  keyAdsWatched: number;
}

export const CHEST_DATA: Record<ChestTier, ChestConfig> = {
  Bronze: {
    tier: 'Bronze',
    cost: 5,
    colorHex: '#cd7f32',
    glowColorHex: 'rgba(205, 127, 50, 0.5)',
  },
  Silver: {
    tier: 'Silver',
    cost: 15,
    colorHex: '#c0c0c0',
    glowColorHex: 'rgba(192, 192, 192, 0.5)',
  },
  Gold: {
    tier: 'Gold',
    cost: 50,
    colorHex: '#ffd700',
    glowColorHex: 'rgba(255, 215, 0, 0.6)',
  },
  Mythic: {
    tier: 'Mythic',
    cost: 150,
    colorHex: '#e11d48', // rose-600 Base but highly animated fuchsia overlays
    glowColorHex: 'rgba(217, 70, 239, 0.8)',
  },
};
