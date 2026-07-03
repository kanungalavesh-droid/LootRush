import { motion, useAnimation } from 'motion/react';
import { PackageOpen, Sparkles, Gem } from 'lucide-react';
import { ChestTier, CHEST_DATA } from '../types';
import { useEffect, useState } from 'react';

interface ChestProps {
  tier: ChestTier;
  onClick: () => void;
  disabled?: boolean;
}

export function Chest({ tier, onClick, disabled }: ChestProps) {
  const config = CHEST_DATA[tier];
  
  // A simple floating animation loop
  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.button
      onClick={!disabled ? onClick : undefined}
      className={`relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center rounded-3xl outline-none group ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={floatAnimation}
    >
      {/* Background ambient glow */}
      <div 
        className="absolute inset-0 rounded-[40px] blur-[30px] opacity-70 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen"
        style={{ backgroundColor: config.glowColorHex }}
      />
      
      {/* Animated Light Rays */}
      <motion.div 
        className="absolute inset-0 opacity-40 mix-blend-screen scale-150"
        animate={!disabled ? { rotate: 360 } : {}}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="rays" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={config.glowColorHex} stopOpacity="1" />
              <stop offset="100%" stopColor={config.glowColorHex} stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M50 50 L0 0 L10 0 Z" fill="url(#rays)" />
          <path d="M50 50 L30 0 L40 0 Z" fill="url(#rays)" />
          <path d="M50 50 L60 0 L70 0 Z" fill="url(#rays)" />
          <path d="M50 50 L90 0 L100 0 Z" fill="url(#rays)" />
          <path d="M50 50 L100 20 L100 30 Z" fill="url(#rays)" />
          <path d="M50 50 L100 60 L100 70 Z" fill="url(#rays)" />
          <path d="M50 50 L100 100 L90 100 Z" fill="url(#rays)" />
          <path d="M50 50 L70 100 L60 100 Z" fill="url(#rays)" />
          <path d="M50 50 L40 100 L30 100 Z" fill="url(#rays)" />
          <path d="M50 50 L10 100 L0 100 Z" fill="url(#rays)" />
          <path d="M50 50 L0 80 L0 70 Z" fill="url(#rays)" />
          <path d="M50 50 L0 40 L0 30 Z" fill="url(#rays)" />
        </svg>
      </motion.div>

      {/* Hexagon/Rhombus pedestal outline */}
      <div className="absolute bottom-4 w-32 h-8 rounded-[100%] border border-white/10 bg-black/40 shadow-2xl" />

      {/* The main Chest icon visual composition */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
           className="relative"
           initial={{ rotate: 0 }}
           animate={!disabled ? { rotate: [0, -2, 2, -2, 2, 0] } : {}}
           transition={{ duration: 0.5, delay: Math.random() * 5, repeat: Infinity, repeatDelay: Math.random() * 10 + 5 }}
        >
          <PackageOpen 
            className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-2xl"
            style={{ color: config.colorHex, filter: `drop-shadow(0 0 15px ${config.glowColorHex})` }}
          />
          {tier === 'Mythic' && (
            <motion.div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90"
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
            >
              <Gem className="w-8 h-8 fill-fuchsia-400 opacity-80" />
            </motion.div>
          )}
        </motion.div>

        {/* Ambient sparkles */}
        <motion.div 
          className="absolute -top-4 -right-4"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-white opacity-80" />
        </motion.div>
      </div>

    </motion.button>
  );
}
