import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserState, Reward, ChestTier, CHEST_DATA, ThemeType } from '../types';

interface GameContextType {
  user: UserState;
  theme: ThemeType;
  toggleTheme: () => void;
  addKeys: (amount: number) => void;
  addCoins: (amount: number) => void;
  deductCoins: (amount: number) => void;
  openChest: (tier: ChestTier) => Promise<Reward[]>;
  watchAd: (type: 'coins' | 'keys') => { defaultReward: number, milestoneReward: number };
  resetState: () => void;
}

const INITIAL_STATE: UserState = {
  keys: 15,
  coins: 1500,
  level: 5,
  streak: 3,
  history: [],
  coinAdsWatched: 0,
  keyAdsWatched: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(INITIAL_STATE);
  const [theme, setTheme] = useState<ThemeType>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addKeys = (amount: number) => {
    setUser((prev) => ({ ...prev, keys: prev.keys + amount }));
  };

  const addCoins = (amount: number) => {
    setUser((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

  const deductCoins = (amount: number) => {
    setUser((prev) => ({ ...prev, coins: prev.coins - amount }));
  };

  const watchAd = (type: 'coins' | 'keys') => {
    const isCoins = type === 'coins';
    const currentWatched = isCoins ? user.coinAdsWatched : user.keyAdsWatched;
    const willBeMilestone = (currentWatched + 1) % 5 === 0;
    
    const defaultReward = isCoins ? 50 : 2;
    const milestoneReward = willBeMilestone ? (isCoins ? 500 : 15) : 0;

    setUser((prev) => {
      const next = { ...prev };
      if (isCoins) {
        next.coinAdsWatched += 1;
        next.coins += defaultReward + milestoneReward;
      } else {
        next.keyAdsWatched += 1;
        next.keys += defaultReward + milestoneReward;
      }
      return next;
    });

    return { defaultReward, milestoneReward };
  };

  const openChest = async (tier: ChestTier): Promise<Reward[]> => {
    const config = CHEST_DATA[tier];
    if (user.keys < config.cost) {
      throw new Error("Not enough keys");
    }

    // Deduct cost immediately
    setUser((prev) => ({ ...prev, keys: prev.keys - config.cost }));

    // Simulate network request/rng processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple RNG logic for demo purposes
    const rewards: Reward[] = [];
    
    // Base Coin reward
    const coinAmount = Math.floor(Math.random() * 50) + (config.cost * 10);
    rewards.push({
      id: Math.random().toString(),
      name: `${coinAmount} Coins`,
      amount: coinAmount,
      type: 'Coins',
      rarity: 'Common',
    });

    // Keys cashback drop chance
    if (Math.random() > 0.6) {
      const keysBack = Math.max(1, Math.floor(config.cost * 0.2));
      rewards.push({
        id: Math.random().toString(),
        name: `${keysBack} Keys`,
        amount: keysBack,
        type: 'Keys',
        rarity: 'Uncommon',
      });
    }

    // Rare drop logic
    const rareRoll = Math.random();
    let dropRarity: Reward['rarity'] = 'Common';
    
    if (tier === 'Bronze') dropRarity = rareRoll > 0.95 ? 'Rare' : 'Common';
    if (tier === 'Silver') dropRarity = rareRoll > 0.8 ? 'Rare' : 'Uncommon';
    if (tier === 'Gold') dropRarity = rareRoll > 0.6 ? 'Epic' : 'Rare';
    if (tier === 'Mythic') dropRarity = rareRoll > 0.4 ? 'Mythic' : 'Epic';

    if (dropRarity === 'Rare') {
      rewards.push({
        id: Math.random().toString(),
        name: 'Cool Avatar Frame',
        type: 'Card',
        rarity: 'Rare'
      });
    } else if (dropRarity === 'Epic') {
      rewards.push({
        id: Math.random().toString(),
        name: '60 UC Pack',
        type: 'RealReward',
        rarity: 'Epic'
      });
    } else if (dropRarity === 'Mythic') {
      rewards.push({
        id: Math.random().toString(),
        name: '1000 INR Amazon Voucher',
        type: 'RealReward',
        rarity: 'Mythic'
      });
    }

    // Process Coins and keys back
    addCoins(coinAmount);
    const keysRewarded = rewards.find(r => r.type === 'Keys')?.amount || 0;
    if (keysRewarded > 0) {
      addKeys(keysRewarded);
    }

    setUser((prev) => ({
      ...prev,
      history: [...rewards, ...prev.history].slice(0, 50),
    }));

    return rewards;
  };

  const resetState = () => setUser(INITIAL_STATE);

  return (
    <GameContext.Provider value={{ user, theme, toggleTheme, addKeys, addCoins, deductCoins, openChest, watchAd, resetState }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
