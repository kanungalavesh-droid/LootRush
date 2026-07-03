import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Reward, ChestTier, CHEST_DATA } from '../types';
import confetti from 'canvas-confetti';
import { PackageOpen, X, Star } from 'lucide-react';

import { playEffect } from '../lib/effects';

interface ChestRevealModalProps {
  isOpen: boolean;
  tier: ChestTier;
  rewards: Reward[];
  onClose: () => void;
}

export function ChestRevealModal({ isOpen, tier, rewards, onClose }: ChestRevealModalProps) {
  const [phase, setPhase] = useState<'shaking' | 'burst' | 'reveal' | 'idle'>('idle');
  const [visibleRewardIdx, setVisibleRewardIdx] = useState(-1);

  const config = CHEST_DATA[tier];

  useEffect(() => {
    if (isOpen) {
      setPhase('shaking');
      
      const shakeInterval = setInterval(() => {
        playEffect('chest-shake');
      }, 400);
      
      const shakeTimer = setTimeout(() => {
        clearInterval(shakeInterval);
        setPhase('burst');
        playEffect('chest-burst');
        triggerConfetti(config.colorHex);
        
        setTimeout(() => {
          setPhase('reveal');
          playEffect('magic');
          // Reveal cards sequentially
          let idx = 0;
          const interval = setInterval(() => {
            if (idx < rewards.length) {
              const currentReward = rewards[idx];
              if (currentReward.rarity === 'Mythic') {
                playEffect('success');
                triggerMythicBurst();
              } else {
                playEffect('coin');
              }
              setVisibleRewardIdx(idx);
              idx++;
            } else {
              clearInterval(interval);
            }
          }, 600); // 600ms between each reward appearance
        }, 800);
      }, 2000); // 2s of shaking

      return () => clearTimeout(shakeTimer);
    } else {
      setPhase('idle');
      setVisibleRewardIdx(-1);
    }
  }, [isOpen, tier, rewards]);

  const triggerMythicBurst = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#f43f5e', '#d946ef', '#4338ca', '#ffffff', '#eab308'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.8 },
        colors: colors,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.8 },
        colors: colors,
        disableForReducedMotion: true
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const triggerConfetti = (color: string) => {
    const end = Date.now() + 1500;
    const colors = [color, '#ffffff', '#22d3ee'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
      >
        {/* Ambient overlay background */}
        <motion.div 
          className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
          animate={{ background: `radial-gradient(circle at 50% 50%, ${config.glowColorHex} 0%, transparent 60%)` }}
        />

        {phase === 'shaking' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1, 1, 1, 1, 1, 1.1, 1.2, 1.3, 1.4], 
              opacity: 1,
              x: [0, -10, 10, -20, 20, -30, 30, -50, 50, 0],
              y: [0, -5, 10, -15, 15, -25, 25, -40, 40, 0],
              rotate: [0, -5, 5, -10, 10, -15, 15, -25, 25, 0]
            }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut",
              times: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 0.95, 1]
            }}
            className="relative z-10"
          >
            {/* Spinning background glow behind the chest inside the modal */}
            <motion.div 
              className="absolute inset-0 blur-[40px] opacity-80 mix-blend-screen"
              style={{ backgroundColor: config.glowColorHex }}
              animate={{ scale: [1, 1.5, 1], rotate: 360 }}
              transition={{ duration: 0.5, ease: "linear", repeat: Infinity }}
            />
            
            <PackageOpen 
              className="relative w-48 h-48 drop-shadow-2xl z-10"
              style={{ color: config.colorHex, filter: `drop-shadow(0 0 30px ${config.glowColorHex})` }}
            />
          </motion.div>
        )}

        {phase === 'burst' && (
          <motion.div
            initial={{ scale: 1.4, opacity: 1, y: 0 }}
            animate={{ scale: 4, opacity: 0, y: -200, rotate: 180 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50 mix-blend-screen"
          >
            <PackageOpen 
              className="w-48 h-48 drop-shadow-2xl"
              style={{ color: '#ffffff', filter: `drop-shadow(0 0 80px ${config.glowColorHex})` }}
            />
          </motion.div>
        )}

        {(phase === 'burst' || phase === 'reveal') && (
          <div className="flex flex-col items-center justify-center w-full z-10 space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="text-3xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] text-center"
            >
              Loot Found!
            </motion.h2>

            <div className="flex flex-wrap justify-center gap-4 max-w-lg">
              <AnimatePresence>
                {rewards.map((reward, i) => (
                  i <= visibleRewardIdx && (
                    <RewardCard key={reward.id} reward={reward} index={i} />
                  )
                ))}
              </AnimatePresence>
            </div>
            
            {visibleRewardIdx >= rewards.length - 1 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  playEffect('click');
                  onClose();
                }}
                className="mt-8 px-8 py-3 bg-cyan-500/20 text-cyan-50 font-bold uppercase tracking-widest rounded-full border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:bg-cyan-500/40 hover:scale-105 active:scale-95 transition-all outline-none"
              >
                Collect All
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function RewardCard({ reward, index }: { reward: Reward; index: number }) {
  const rarityColors = {
    Common: "from-slate-600 to-slate-800 border-slate-500",
    Uncommon: "from-emerald-600 to-emerald-900 border-emerald-500",
    Rare: "from-blue-600 to-blue-900 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    Epic: "from-purple-600 to-purple-900 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.7)]",
    Mythic: "from-rose-500 via-fuchsia-600 to-indigo-700 border-fuchsia-400 shadow-[0_0_30px_rgba(217,70,239,0.8)]"
  };

  const glowColors = {
    Common: "transparent",
    Uncommon: "transparent",
    Rare: "#3b82f6",
    Epic: "#a855f7",
    Mythic: "#d946ef"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
      }}
      className={`relative w-32 h-44 sm:w-40 sm:h-56 rounded-xl border flex flex-col items-center justify-between p-3 bg-gradient-to-br transition-all group hover:scale-105 z-10 overflow-hidden ${rarityColors[reward.rarity]}`}
    >
      <motion.div 
        className="absolute inset-0 rounded-xl mix-blend-screen pointer-events-none"
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
        style={{ 
          boxShadow: `inset 0 0 30px ${glowColors[reward.rarity]}`,
          backgroundColor: glowColors[reward.rarity] !== 'transparent' ? `${glowColors[reward.rarity]}10` : 'transparent'
        }}
      />
      <div className="w-full flex justify-center z-10">
        <span className="text-[10px] sm:text-xs font-black uppercase text-white/70 tracking-widest bg-black/40 px-2 py-0.5 rounded-full">
          {reward.rarity}
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-center z-10">
        {reward.rarity === 'Mythic' || reward.rarity === 'Epic' ? (
          <Star className="w-12 h-12 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] fill-yellow-300" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-black text-2xl text-white">
            {reward.type === 'Coins' ? 'C' : reward.type === 'Keys' ? 'K' : '🎁'}
          </div>
        )}
      </div>

      <div className="text-center w-full bg-black/50 p-2 rounded-lg backdrop-blur-sm z-10">
        <p className="text-xs sm:text-sm font-bold text-white leading-tight">
          {reward.name}
        </p>
      </div>
    </motion.div>
  );
}
