import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../store/GameContext';
import { Chest } from './Chest';
import { ChestRevealModal } from './ChestRevealModal';
import { ChestTier, Reward, CHEST_DATA } from '../types';
import { Play, PlaySquare, CheckCircle, ShieldCheck, Flame, ChevronRight, ChevronLeft, Gamepad2, Coins as CoinsIcon, ShoppingCart, Key, Ticket, Zap, UserPlus, Camera, HelpCircle, Lock, Sparkles, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { playEffect } from '../lib/effects';

// ----------------------------------------------------------------------
// Home Screen (Banners, Games, Chests)
// ----------------------------------------------------------------------
const BANNERS = [
  { id: 1, imageUrl: 'https://i.ibb.co/RpCywdzR/Chat-GPT-Image-Jun-1-2026-11-44-55-PM.png', title: 'Mystery Chests', desc: 'Unlock Rare Vouchers', color: 'bg-black', hue: 'bg-indigo-500/20' },
  { id: 2, imageUrl: 'https://i.ibb.co/0VcdpNxX/Chat-GPT-Image-Jun-1-2026-11-45-49-PM.png', title: 'Mega Jackpot', desc: 'Win up to 10k Coins Daily', color: 'bg-black', hue: 'bg-purple-500/20' },
  { id: 3, imageUrl: 'https://i.ibb.co/fdNRJvx1/Chat-GPT-Image-Jun-1-2026-11-45-39-PM.png', title: 'New Games Added', desc: 'Play & Earn More', color: 'bg-black', hue: 'bg-orange-500/20' },
];

const GAMES = [
  { id: 1, name: 'Neon Rider', type: 'Racing', reward: 'Up to 500 Coins', color: 'bg-indigo-500' },
  { id: 2, name: 'Cyber Jump', type: 'Arcade', reward: 'Up to 300 Coins', color: 'bg-pink-500' },
  { id: 3, name: 'Cosmic Strike', type: 'Action', reward: 'Up to 1000 Coins', color: 'bg-red-500' },
  { id: 4, name: 'Pixel Quest', type: 'RPG', reward: 'Up to 200 Coins', color: 'bg-green-500' },
  { id: 5, name: 'Aero Clash', type: 'Shooter', reward: 'Up to 450 Coins', color: 'bg-blue-500' },
  { id: 6, name: 'Retro Drift', type: 'Racing', reward: 'Up to 600 Coins', color: 'bg-orange-500' },
  { id: 7, name: 'Block Puzzle', type: 'Puzzle', reward: 'Up to 150 Coins', color: 'bg-teal-500' },
  { id: 8, name: 'Neon Pong', type: 'Arcade', reward: 'Up to 100 Coins', color: 'bg-cyan-500' },
  { id: 9, name: 'Galaxy Miner', type: 'Strategy', reward: 'Up to 800 Coins', color: 'bg-yellow-500' },
  { id: 10, name: 'Blade 2099', type: 'Action', reward: 'Up to 750 Coins', color: 'bg-purple-500' },
];

export function ActivityActionCard({ title, desc, reward, type, icon }: { title: string, desc: string, reward: number, type: 'coins' | 'keys', icon: React.ReactNode }) {
  const { theme, addCoins, addKeys } = useGame();
  const [loading, setLoading] = useState(false);

  const handleAction = () => {
    setLoading(true);
    playEffect('click');
    setTimeout(() => {
      if (type === 'coins') addCoins(reward);
      else addKeys(reward);
      playEffect('coin');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 }, zIndex: 100, colors: type === 'coins' ? ['#facc15', '#ffffff'] : ['#3b82f6', '#ffffff'] });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={cn(
      "p-3 rounded-2xl border flex items-center gap-3 shadow-md transition-all hover:scale-[1.02]",
      theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
    )}>
      <div className={cn("w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border",
        theme === 'dark' ? "bg-black/40 border-white/5 text-gray-300" : "bg-indigo-50 border-indigo-100 text-indigo-600"
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className={cn("font-bold text-sm", theme === 'dark' ? "text-gray-200" : "text-indigo-950")}>{title}</h4>
        <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={handleAction}
        disabled={loading}
        className={cn("flex flex-col items-center justify-center gap-1 shrink-0 px-3 py-1.5 rounded-lg border active:scale-95 transition-all outline-none",
          type === 'coins'
            ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
            : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20"
        )}
      >
        <span className="text-[10px] uppercase font-bold tracking-widest leading-none">{loading ? "..." : "Claim"}</span>
        <span className="text-[12px] font-black flex items-center gap-1 leading-none mt-1">
          {type === 'coins' ? <CoinsIcon className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />} {reward}
        </span>
      </button>
    </div>
  );
}

export function LuckyPickSection() {
  const { theme, addCoins } = useGame();
  const [played, setPlayed] = useState(false);
  
  const handlePick = (won: number) => {
    playEffect('chest-burst');
    setTimeout(() => {
      addCoins(won);
      playEffect('coin');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, zIndex: 100, colors: ['#facc15', '#ffffff'] });
    }, 600);
    setPlayed(true);
  };

  return (
    <div className="w-full shrink-0">
      <div className="flex justify-between items-end mb-3 px-1 text-inherit">
        <h3 className={cn("font-black tracking-widest uppercase text-sm", theme === 'dark' ? "text-pink-400" : "text-pink-600")}>Daily Lucky Pick</h3>
      </div>
      <div className={cn(
          "w-full rounded-3xl p-5 border shadow-xl relative overflow-hidden flex flex-col items-center bg-gradient-to-br",
          theme === 'dark' ? "from-pink-900/40 to-purple-900/40 border-pink-500/20" : "from-pink-100 to-purple-100 border-pink-200"
      )}>
        <p className={cn("text-xs font-bold uppercase tracking-widest mb-4 z-10", theme === 'dark' ? "text-pink-300" : "text-pink-600")}>
          {played ? "Come back tomorrow" : "Pick a card, win coins!"}
        </p>
        <div className="flex gap-4 justify-center w-full z-10">
           <LuckyPickCard disabled={played} onPick={handlePick} />
           <LuckyPickCard disabled={played} onPick={handlePick} />
           <LuckyPickCard disabled={played} onPick={handlePick} />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none" />
      </div>
    </div>
  );
}

function LuckyPickCard({ disabled, onPick }: { disabled: boolean, onPick: (reward: number) => void }) {
  const { theme } = useGame();
  const [flipped, setFlipped] = useState(false);
  const [reward, setReward] = useState(0);

  const handleFlip = () => {
    if (flipped || disabled) return;
    const amounts = [10, 50, 100, 200, 500];
    const won = amounts[Math.floor(Math.random() * amounts.length)];
    setReward(won);
    setFlipped(true);
    onPick(won);
  };

  return (
    <motion.div
      whileHover={!flipped && !disabled ? { scale: 1.05 } : {}}
      whileTap={!flipped && !disabled ? { scale: 0.95 } : {}}
      onClick={handleFlip}
      className={cn(
        "flex-1 max-w-[80px] aspect-[2/3] rounded-xl cursor-pointer",
        flipped || disabled ? "opacity-90 cursor-default" : ""
      )}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full h-full relative"
      >
        <div 
          className={cn(
             "absolute inset-0 flex flex-col items-center justify-center rounded-xl shadow-lg border-2",
             theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-100"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <HelpCircle className={cn("w-8 h-8", theme === 'dark' ? "text-gray-600" : "text-gray-300")} />
        </div>
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-xl border-2 border-yellow-300"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <CoinsIcon className="w-8 h-8 text-white mb-1 drop-shadow-md" />
          <span className="text-sm font-black text-white drop-shadow-md">+{reward}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GameLibrarySection() {
  const { theme } = useGame();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 40 : scrollLeft + clientWidth - 40;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full shrink-0">
      <div className="flex justify-between items-end mb-3 px-1">
        <h3 className={cn("font-black tracking-widest uppercase text-sm", theme === 'dark' ? "text-cyan-400" : "text-cyan-600")}>Game Library</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center border transition-colors outline-none",
              theme === 'dark' ? "bg-white/10 hover:bg-white/20 border-white/20" : "bg-white/80 hover:bg-white border-indigo-100 shadow-sm backdrop-blur-md"
            )}
          >
            <ChevronLeft className={cn("w-3.5 h-3.5", theme === 'dark' ? "text-white" : "text-indigo-600")} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center border transition-colors outline-none",
              theme === 'dark' ? "bg-white/10 hover:bg-white/20 border-white/20" : "bg-white/80 hover:bg-white border-indigo-100 shadow-sm backdrop-blur-md"
            )}
          >
            <ChevronRight className={cn("w-3.5 h-3.5", theme === 'dark' ? "text-white" : "text-indigo-600")} />
          </button>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
        {GAMES.map((game) => (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={game.id} 
            className={cn(
              "snap-start shrink-0 w-32 rounded-2xl p-3 border shadow-lg flex flex-col cursor-pointer transition-colors",
              theme === 'dark' ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/80 border-indigo-100 hover:bg-white backdrop-blur-md shadow-indigo-200/50"
            )}
            onClick={() => playEffect('click')}
          >
            <div className={cn("w-full h-24 rounded-xl flex items-center justify-center mb-3 shadow-inner", game.color)}>
              <Gamepad2 className="w-10 h-10 text-white/50" />
            </div>
            <h4 className={cn("font-bold text-sm truncate", theme === 'dark' ? "text-gray-200" : "text-indigo-950")}>{game.name}</h4>
            <p className="text-[9px] uppercase tracking-wider text-indigo-400 mt-1">{game.type}</p>
            <div className="mt-2 flex items-center gap-1.5 bg-yellow-400/10 self-start px-2 py-1 rounded border border-yellow-400/20">
              <CoinsIcon className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400">{game.reward}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function HomeScreen() {
  const { user, openChest, theme } = useGame();
  
  const [activeBanner, setActiveBanner] = useState(0);
  const [selectedTier, setSelectedTier] = useState<ChestTier>('Bronze');
  const [isOpening, setIsOpening] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rewardsList, setRewardsList] = useState<Reward[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenChest = async () => {
    try {
      setIsOpening(true);
      const output = await openChest(selectedTier);
      setRewardsList(output);
      setModalOpen(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="flex flex-col h-full pt-2 pb-24 px-4 overflow-y-auto w-full space-y-6 hide-scrollbar">
      
      {/* Banner Carousel */}
      <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-xl shrink-0 mt-4">
        <AnimatePresence initial={false}>
          {BANNERS.map((banner, i) => i === activeBanner && (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, zIndex: -1 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 bg-gradient-to-r ${banner.color} ${(banner as any).imageUrl ? 'p-0' : 'p-6'} flex flex-col justify-center overflow-hidden`}
            >
              {(banner as any).imageUrl ? (
                <div className="w-full h-full relative">
                  <img src={(banner as any).imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                </div>
              ) : (banner as any).type === 'mystery-chest' ? (
                <div className="flex w-full h-full justify-between items-center relative select-none">
                  <div className="absolute inset-0 overflow-hidden -m-6 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#7a1bf2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-80 z-0"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0a5cff] rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 opacity-50 z-0"></div>
                    {/* Magical floating particles */}
                    <div className="absolute top-[20%] left-[45%] w-1.5 h-1.5 bg-yellow-400 rotate-45 opacity-80 shadow-[0_0_8px_rgba(250,204,21,1)]"></div>
                    <div className="absolute top-[70%] left-[85%] w-2 h-2 bg-yellow-300 rotate-45 opacity-90 shadow-[0_0_10px_rgba(250,204,21,1)]"></div>
                    <div className="absolute top-[40%] left-[10%] w-1 h-1 bg-blue-400 rotate-45 opacity-60"></div>
                  </div>

                  {/* Left side text content */}
                  <div className="flex flex-col relative z-20 w-[55%] pt-1">
                    <div className="flex mb-1.5 z-20">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-600 p-[1.5px] relative shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                        <div className="w-full h-full bg-[#110636] rounded-[6px] flex flex-col items-center justify-center relative overflow-hidden">
                          <Package className="w-4 h-4 text-purple-200" />
                          <div className="absolute font-black text-[7px] text-white top-[2px] right-[2px]">?</div>
                          <div className="absolute font-black text-[7px] text-white bottom-[2px] left-[2px]">?</div>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-3xl font-black italic tracking-tighter leading-[0.9] drop-shadow-xl flex flex-col z-20" style={{ transform: 'skewX(-4deg)' }}>
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-50 to-[#b599ff] drop-shadow-sm pb-1">MYSTERY</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#29b6ff] to-[#0152e6] drop-shadow-md pb-1 relative z-10" style={{ textShadow: '0 4px 15px rgba(1, 82, 230, 0.4)' }}>CHESTS</span>
                    </h2>

                    <div className="mt-2.5 flex items-center gap-1.5 bg-[#090524]/90 border border-blue-400/40 rounded-full px-2.5 py-1 w-fit shadow-[0_0_12px_rgba(41,182,255,0.3)] z-20 backdrop-blur-sm relative" style={{ transform: 'skewX(-2deg)' }}>
                      <Lock className="w-[10px] h-[10px] text-[#29b6ff]" />
                      <span className="text-white text-[9px] font-bold uppercase tracking-widest leading-none pt-0.5">Unlock Rare Vouchers</span>
                    </div>
                  </div>

                  {/* Right side Chest illustration */}
                  <div className="relative z-10 w-[45%] h-full flex items-center justify-end -mt-2 pr-2 pointer-events-none">
                    <div className="relative transform-gpu scale-110 -translate-x-2">
                       {/* Light rays originating from chest */}
                       <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-24 bg-gradient-to-t from-yellow-400/0 via-yellow-400/30 to-purple-500/0 rounded-[100%] blur-xl opacity-80" style={{ boxShadow: '0 0 40px 10px rgba(250, 204, 21, 0.3)' }}></div>
                       
                       {/* Curved white/purple swoosh lines crossing behind chest */}
                       <svg className="absolute -inset-[50px] w-[180px] h-[180px] -translate-x-4 -translate-y-8 z-0 opacity-70" viewBox="0 0 100 100">
                         <path d="M 0 80 Q 50 100 100 30" fill="none" stroke="url(#gradient)" strokeWidth="1" strokeLinecap="round" />
                         <path d="M 10 90 Q 60 110 110 40" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="0.5" />
                         <defs>
                           <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="transparent" />
                             <stop offset="50%" stopColor="#fff" />
                             <stop offset="100%" stopColor="transparent" />
                           </linearGradient>
                         </defs>
                       </svg>

                       {/* Abstract Chest Construction */}
                       <div className="w-[72px] h-[52px] bg-gradient-to-b from-[#1c185e] to-[#0d072e] rounded border border-[#482cd4] relative z-20 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden">
                           {/* Chest structural details */}
                           <div className="w-full h-1/2 flex items-end">
                              <div className="w-full h-[3px] bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 border-y border-yellow-200/50 shadow-[0_0_15px_rgba(250,204,21,0.8)] z-30 flex justify-center"></div>
                           </div>
                           <div className="absolute inset-0 grid grid-cols-3 gap-0.5 opacity-20 p-1 pointer-events-none">
                              {[1,2,3,4,5,6].map(x=><div key={x} className="bg-indigo-300/30 rounded-sm"></div>)}
                           </div>
                       </div>
                       
                       {/* Chest glowing core opening */}
                       <div className="absolute top-[42%] left-[5%] right-[5%] h-2 bg-white rounded-full blur-[4px] z-20"></div>

                       {/* Chest Lock Mechanism */}
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-7 rounded-sm bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-600 p-[1.5px] z-30 shadow-lg mt-1">
                          <div className="w-full h-full bg-[#0d072e] flex items-center justify-center border border-yellow-600">
                             <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex flex-col items-center shadow-[0_0_5px_rgba(234,179,8,1)]">
                               <div className="w-1 h-1.5 bg-yellow-400 rounded-b mt-[4px]"></div>
                             </div>
                          </div>
                       </div>
                       
                       {/* Ejected Loot Items */}
                       <div className="absolute -top-3 left-[5%] w-[42px] h-[42px] rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(250,204,21,0.6)] z-20 border border-yellow-200" style={{ transform: 'perspective(100px) rotateX(15deg) rotateY(-15deg)' }}>
                         <div className="w-full h-full rounded-full border border-yellow-700/30 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600">
                            <span className="font-black text-yellow-900 text-lg leading-none" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.4)' }}>R</span>
                         </div>
                       </div>

                       <div className="absolute top-[10px] -left-[14px] w-[22px] h-[22px] rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center p-[1px] shadow-[0_0_10px_rgba(250,204,21,0.5)] z-30 rotate-[-15deg]">
                         <div className="w-full h-full rounded-full border border-yellow-700/30 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600">
                            <span className="font-black text-yellow-900 text-[10px] leading-none">R</span>
                         </div>
                       </div>
                       
                       <div className="absolute top-[10px] -right-[15px] w-[30px] h-[30px] rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center p-[1px] shadow-[0_0_10px_rgba(250,204,21,0.5)] z-10 rotate-[20deg]" style={{ transform: 'perspective(100px) rotateX(10deg) rotateY(25deg)' }}>
                         <div className="w-full h-full rounded-full border border-yellow-700/30 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600">
                            <span className="font-black text-yellow-900 text-sm leading-none">R</span>
                         </div>
                       </div>

                       <div className="absolute top-[-15px] right-[5px] w-[26px] h-[40px] bg-gradient-to-br from-[#4d66ff] to-[#6019ff] rounded rotate-[20deg] border border-[#a68aff] shadow-[0_0_12px_rgba(96,25,255,0.6)] flex items-center justify-center z-10 skew-y-[10deg]">
                          <span className="font-black text-white text-xs drop-shadow">%</span>
                       </div>
                       
                       {/* Top lid of chest (detached/open) */}
                       <div className="absolute top-[-10px] left-0 w-[72px] h-[20px] bg-gradient-to-b from-[#292275] to-[#120f3d] rounded-t-xl border-t border-x border-[#482cd4] rotate-[-8deg] origin-bottom-right z-30 flex items-end">
                           <div className="w-full h-[3px] bg-yellow-500/80 mb-0.5"></div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none"></div>
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-wider drop-shadow-md z-10 relative">{banner.title}</h2>
                  <p className="text-white/90 text-sm font-bold uppercase tracking-widest mt-1 z-10 relative">{banner.desc}</p>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {BANNERS.map((_, i) => (
            <div key={i} className={cn("w-2 h-2 rounded-full transition-all", i === activeBanner ? "bg-white w-4" : "bg-white/40")} />
          ))}
        </div>
      </div>

      {/* Daily Streak Timeline */}
      <div className="w-full shrink-0">
        <div className="flex justify-between items-end mb-3 px-1 text-inherit">
          <h3 className={cn("font-black tracking-widest uppercase text-sm", theme === 'dark' ? "text-orange-400" : "text-orange-600")}>7-Day Streak</h3>
        </div>
        
        <div className={cn(
          "flex items-center justify-between p-4 rounded-3xl border shadow-lg overflow-x-auto gap-2 hide-scrollbar",
          theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white/90 border-indigo-100 backdrop-blur-xl shadow-indigo-200/40"
        )}>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCompleted = day <= user.streak;
            const isToday = day === user.streak + 1;
            const rewardCoins = day * 50;
            return (
              <div key={day} className="flex flex-col items-center gap-2 min-w-[3.5rem]">
                <div className={cn(
                    "text-[10px] font-bold uppercase", 
                    isCompleted ? "text-orange-500" : isToday ? "text-yellow-600 dark:text-yellow-500" : "text-gray-400"
                )}>Day {day}</div>
                <div className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-xl border-2 transition-all p-1",
                    isCompleted ? "bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" :
                    isToday ? "bg-yellow-500/20 border-yellow-500 text-yellow-600 dark:text-yellow-400 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.5)]" :
                    (theme === 'dark' ? "bg-white/5 border-white/10 text-gray-500" : "bg-white/60 border-indigo-100 text-indigo-400 shadow-sm")
                )}>
                    {isCompleted ? <CheckCircle className="w-4 h-4 mb-0.5"/> : <Zap className="w-4 h-4 mb-0.5"/>}
                    <div className="flex items-center gap-0.5 text-[9px] font-black">
                      <CoinsIcon className="w-2.5 h-2.5" /> {rewardCoins}
                    </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activities Tab Section */}
      <div className="w-full shrink-0">
        <div className="flex justify-between items-end mb-3">
          <h3 className={cn("font-black tracking-widest uppercase text-sm", theme === 'dark' ? "text-purple-400" : "text-purple-600")}>Daily Activities</h3>
          <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center">Complete to Earn</span>
        </div>
        
        <div className="flex flex-col gap-3">
          <ActivityActionCard title="Watch a Short Ad" desc="Unlimited entries." reward={50} type="coins" icon={<PlaySquare className="w-5 h-5"/>} />
          <ActivityActionCard title="Follow Instagram" desc="Stay updated with news." reward={200} type="coins" icon={<Camera className="w-5 h-5"/>} />
          <ActivityActionCard title="Invite a Friend" desc="Get rewarded for invites." reward={10} type="keys" icon={<UserPlus className="w-5 h-5"/>} />
        </div>
      </div>

      {/* Mystery Chests Section */}
      <div className="w-full shrink-0 flex flex-col items-center">
        <div className="w-full flex justify-between items-end mb-4 px-1">
          <h3 className={cn("font-black tracking-widest uppercase", theme === 'dark' ? "text-blue-400" : "text-blue-600")}>Mystery Chests</h3>
        </div>

        <div 
          className={cn(
            "w-full rounded-3xl p-6 flex flex-col items-center border shadow-xl relative overflow-hidden transition-colors duration-500",
            theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white/90 border-indigo-100 backdrop-blur-xl shadow-indigo-200/40"
          )}
          style={{ 
            boxShadow: `0 10px 40px -10px ${CHEST_DATA[selectedTier].glowColorHex}40`,
            borderColor: theme === 'dark' ? `${CHEST_DATA[selectedTier].glowColorHex}40` : undefined
          }}
        >
          {/* Subtle background glow based on tier */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none transition-colors duration-500" 
            style={{ backgroundColor: CHEST_DATA[selectedTier].glowColorHex }} 
          />

          <Chest tier={selectedTier} onClick={handleOpenChest} disabled={isOpening || user.keys < (selectedTier === 'Bronze' ? 5 : selectedTier === 'Silver' ? 15 : selectedTier === 'Gold' ? 50 : 150)} />
          
          <div className="flex bg-indigo-50/50 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-indigo-100 dark:border-white/10 shadow-inner w-full max-w-[320px] mt-6 z-10">
            {(['Bronze', 'Silver', 'Gold', 'Mythic'] as ChestTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => {
                  playEffect('tier-switch');
                  setSelectedTier(tier);
                }}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all relative",
                  selectedTier === tier 
                    ? (theme === 'dark' ? "text-white" : "text-indigo-950") 
                    : "text-indigo-400 hover:text-indigo-600 dark:hover:text-gray-300"
                )}
              >
                {selectedTier === tier && (
                  <motion.div
                    layoutId="tier-pill-home"
                    className={cn("absolute inset-0 rounded-full border", theme === 'dark' ? "bg-white/10 border-white/10" : "bg-white shadow-sm border-indigo-100")}
                    style={{ zIndex: 0 }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tier}</span>
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenChest}
            disabled={isOpening}
            className="relative group mt-4 w-full max-w-[280px] z-10"
          >
            <div 
              className="absolute inset-0 blur-md opacity-40 group-hover:opacity-70 transition-opacity rounded-full"
              style={{ backgroundColor: CHEST_DATA[selectedTier].colorHex }}
            ></div>
            <div 
              className="relative px-8 py-3 rounded-full shadow-lg flex items-center justify-center gap-4 outline-none border transition-colors duration-500"
              style={{ 
                backgroundColor: CHEST_DATA[selectedTier].glowColorHex,
                borderColor: CHEST_DATA[selectedTier].colorHex
              }}
            >
              <span className="text-white font-black text-sm uppercase tracking-wider drop-shadow-md">Unlock Chest</span>
              <div className="bg-black/20 text-white text-[10px] font-black px-2 py-0.5 rounded-md border border-white/20 flex items-center gap-1 shadow-inner">
                <Key className="w-3 h-3" />
                {selectedTier === 'Bronze' ? 5 : selectedTier === 'Silver' ? 15 : selectedTier === 'Gold' ? 50 : 150}
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      <LuckyPickSection />
      <GameLibrarySection />

      <ChestRevealModal 
        isOpen={modalOpen} 
        tier={selectedTier} 
        rewards={rewardsList} 
        onClose={() => setModalOpen(false)} 
      />
      <div className="h-4"></div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Earn Screen (Offerwalls / Tasks)
// ----------------------------------------------------------------------
export function AdMilestoneCard({ type }: { type: 'coins' | 'keys' }) {
  const { user, watchAd, theme } = useGame();
  const [loading, setLoading] = useState(false);

  const isCoins = type === 'coins';
  const watched = isCoins ? user.coinAdsWatched : user.keyAdsWatched;
  const target = 5;
  const progress = watched % target;
  
  const milestoneRewardAmount = isCoins ? 500 : 15;
  const defaultRewardAmount = isCoins ? 50 : 2;

  const handleAction = () => {
    setLoading(true);
    playEffect('click');
    setTimeout(() => {
      const { defaultReward, milestoneReward } = watchAd(type);
      if (milestoneReward > 0) {
        playEffect('success');
        confetti({ particleCount: 100, spread: 60, zIndex: 100, origin: { y: 0.7 }, colors: isCoins ? ['#facc15', '#ffffff'] : ['#3b82f6', '#ffffff'] });
      } else {
        playEffect('coin');
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 }, zIndex: 100, colors: isCoins ? ['#facc15'] : ['#3b82f6'] });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={cn(
      "p-4 rounded-2xl border flex flex-col gap-3 shadow-md transition-all hover:scale-[1.01]",
      theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white/90 border-indigo-100/60 shadow-indigo-200/50 backdrop-blur-xl"
    )}>
       <div className="flex justify-between items-start">
         <div className="flex items-center gap-3">
           <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
             isCoins 
               ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-500" 
               : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-500"
           )}>
             <PlaySquare className="w-5 h-5"/>
           </div>
           <div>
              <h4 className={cn("font-bold text-sm tracking-wide", theme === 'dark' ? "text-gray-200" : "text-indigo-950")}>
                Earn {isCoins ? 'Coins' : 'Keys'}
              </h4>
              <p className="text-[10px] uppercase tracking-wide text-indigo-500 mt-0.5">
                Watch {target - progress} more for {milestoneRewardAmount} bonus!
              </p>
           </div>
         </div>
         <button 
           onClick={handleAction}
           disabled={loading}
           className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border active:scale-95 transition-all outline-none shrink-0",
             isCoins
               ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
               : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20"
           )}
         >
           <span className="text-[10px] uppercase font-bold tracking-widest leading-none shrink-0">{loading ? "..." : "Watch"}</span>
           {!loading && (
             <span className="text-[12px] font-black flex items-center gap-0.5 leading-none bg-black/10 dark:bg-black/20 px-1.5 py-0.5 rounded">
               {isCoins ? <CoinsIcon className="w-3 h-3 text-yellow-600 dark:text-yellow-400" /> : <Key className="w-3 h-3 text-blue-600 dark:text-blue-400" />} {defaultRewardAmount}
             </span>
           )}
         </button>
       </div>
       
       <div className="w-full flex gap-1 mt-1">
         {Array.from({ length: target }).map((_, i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-300", 
              i < progress 
               ? (isCoins ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]") 
               : (theme === 'dark' ? "bg-white/10" : "bg-indigo-100")
            )} />
         ))}
       </div>
    </div>
  );
}

export function EarnScreen() {
  const { theme } = useGame();

  return (
    <div className="p-4 pb-24 h-full flex flex-col space-y-6 overflow-y-auto w-full pt-8 hide-scrollbar">
      <div className="px-2">
        <h2 className={cn("text-2xl font-black uppercase tracking-wider", theme === 'dark' ? "text-cyan-400" : "text-cyan-600")}>Activities</h2>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Complete tasks for Rewards</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 px-2">
           <h3 className={cn("font-bold text-xs uppercase tracking-widest", theme === 'dark' ? "text-gray-300" : "text-indigo-800")}>Milestone Rewards</h3>
        </div>
        <div className="flex flex-col gap-3">
           <AdMilestoneCard type="coins" />
           <AdMilestoneCard type="keys" />
        </div>

        <div className="flex flex-col gap-1 px-2 mt-2">
           <h3 className={cn("font-bold text-xs uppercase tracking-widest", theme === 'dark' ? "text-gray-300" : "text-indigo-800")}>Daily Quests</h3>
        </div>
        <ActivityActionCard title="Watch Video Ad" desc="10 entries remaining" reward={100} type="coins" icon={<PlaySquare className="w-6 h-6 text-yellow-500"/>} />
        <ActivityActionCard title="Play Mighty Heroes" desc="Reach Level 15 (2 days)" reward={1500} type="coins" icon={<Gamepad2 className="w-6 h-6 text-purple-500"/>} />
        
        <div className="flex flex-col gap-1 px-2 mt-2">
           <h3 className={cn("font-bold text-xs uppercase tracking-widest", theme === 'dark' ? "text-gray-300" : "text-indigo-800")}>Special Offers</h3>
        </div>
        <ActivityActionCard title="Complete Survey" desc="About gaming habits" reward={450} type="coins" icon={<Ticket className="w-6 h-6 text-orange-500"/>} />
        <ActivityActionCard title="Download SecureVPN" desc="Open and use for 3 mins" reward={15} type="keys" icon={<ShieldCheck className="w-6 h-6 text-blue-500"/>} />
        <ActivityActionCard title="Leave a Review" desc="Rate us on the App Store" reward={50} type="keys" icon={<Zap className="w-6 h-6 text-emerald-500"/>} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Store Screen (Redeem Rewards)
// ----------------------------------------------------------------------
const STORE_ITEMS = [
  { id: 1, imageUrl: 'https://i.ibb.co/YBBYMV1B/Chat-GPT-Image-Jun-1-2026-11-54-39-PM.png', name: 'Amazon Pay Voucher', value: '₹100', cost: 10000, type: 'amazon', color: 'from-orange-500 to-yellow-500' },
  { id: 2, name: 'Google Play Code', value: '₹500', cost: 50000, type: 'google', color: 'from-blue-500 to-green-500' },
  { id: 3, name: 'BGMI UC Pack', value: '60 UC', cost: 8000, type: 'game', color: 'from-yellow-600 to-amber-700' },
  { id: 4, name: 'Free Fire Diamonds', value: '100 Dia', cost: 8000, type: 'game', color: 'from-red-500 to-rose-600' },
];

export function StoreScreen() {
  const { user, deductCoins, theme } = useGame();

  const handleRedeem = (cost: number, name: string) => {
    if (user.coins >= cost) {
      if(confirm(`Redeem ${name} for ${cost} Coins?`)) {
        deductCoins(cost);
        playEffect('success');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#ffffff', '#eab308']
        });
        setTimeout(() => alert(`Successfully redeemed ${name}! Code will be sent to your email.`), 300);
      }
    } else {
      playEffect('error');
      alert("Not enough coins to redeem this item.");
    }
  };

  return (
    <div className="p-4 pb-24 h-full flex flex-col space-y-6 overflow-y-auto w-full pt-8 hide-scrollbar">
      <h2 className={cn("text-2xl font-black uppercase tracking-wider px-2", theme === 'dark' ? "text-yellow-400" : "text-yellow-600")}>Redeem Store</h2>
      
      <div className={cn(
        "rounded-2xl p-6 border shadow-xl flex items-center justify-between",
        theme === 'dark' ? "bg-white/5 backdrop-blur-md border-white/10" : "bg-white/90 border-indigo-100/60 shadow-indigo-200/60 backdrop-blur-xl"
      )}>
        <div>
           <p className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold">Your Balance</p>
           <h3 className={cn("text-3xl font-black mt-1", theme === 'dark' ? "text-white" : "text-indigo-950")}>
             {user.coins.toLocaleString()}
           </h3>
        </div>
        <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-400/50 flex flex-col items-center justify-center">
           <CoinsIcon className="w-8 h-8 text-yellow-500 drop-shadow-md" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {STORE_ITEMS.map((item) => (
          <div key={item.id} className={cn(
            "rounded-2xl p-4 border flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all",
            theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white/80 border-indigo-100 shadow-indigo-200/40 backdrop-blur-lg"
          )}>
            {(item as any).imageUrl ? (
              <div className="w-full aspect-[4/3] rounded-xl mb-3 shrink-0 overflow-hidden shadow-inner">
                <img src={(item as any).imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-inner mb-3 shrink-0`}>
                 <Ticket className="w-6 h-6 text-white/90" />
              </div>
            )}
            <h4 className={cn("font-bold text-xs leading-tight h-8 flex items-center justify-center", theme === 'dark' ? "text-gray-200" : "text-indigo-950")}>{item.name}</h4>
            <p className={cn("text-lg font-black mt-1", theme === 'dark' ? "text-white" : "text-indigo-950")}>{item.value}</p>
            
            <div className="w-full mt-3 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-1 bg-yellow-400/10 px-2 py-1 rounded w-full border border-yellow-400/20">
                <CoinsIcon className="w-3 h-3" /> {item.cost.toLocaleString()}
              </span>
              
              <button 
                onClick={() => { playEffect('click'); handleRedeem(item.cost, item.name); }}
                disabled={user.coins < item.cost}
                className={cn(
                  "w-full text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-colors outline-none",
                  user.coins >= item.cost 
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-md hover:scale-105 active:scale-95" 
                    : (theme === 'dark' ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-indigo-100 text-indigo-500 cursor-not-allowed")
                )}
              >
                {user.coins >= item.cost ? 'Redeem' : 'Locked'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Profile Screen
// ----------------------------------------------------------------------
export function ProfileScreen() {
  const { user, theme } = useGame();
  
  return (
    <div className="p-4 pb-24 h-full flex flex-col space-y-6 overflow-y-auto items-center pt-10 hide-scrollbar">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 p-1 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=LootRush${user.level}&backgroundColor=transparent`} alt="Avatar" className="w-20 h-20 object-cover" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className={cn("text-2xl font-black uppercase tracking-widest", theme === 'dark' ? "text-white" : "text-indigo-950")}>Player_99X</h2>
        <p className="text-purple-500 uppercase tracking-[0.2em] text-[10px] mt-1 font-bold">Level {user.level} Elite</p>
      </div>

      <div className={cn(
        "w-full p-6 rounded-2xl border space-y-4 shadow-xl mt-4",
        theme === 'dark' ? "bg-white/5 backdrop-blur-md border-white/10" : "bg-white/90 border-indigo-100 shadow-indigo-200/50 backdrop-blur-xl"
      )}>
        <div className={cn("flex justify-between items-center text-sm border-b pb-4", theme === 'dark' ? "border-white/10" : "border-indigo-50")}>
          <span className="text-indigo-500 uppercase tracking-wider text-[10px] font-bold">Total Coins Collected</span>
          <span className={cn("font-mono font-bold flex items-center gap-1", theme === 'dark' ? "text-white" : "text-indigo-950")}>
            <CoinsIcon className="w-3 h-3 text-yellow-500" /> {user.coins}
          </span>
        </div>
        <div className={cn("flex justify-between items-center text-sm border-b pb-4", theme === 'dark' ? "border-white/10" : "border-indigo-50")}>
          <span className="text-indigo-500 uppercase tracking-wider text-[10px] font-bold">Current Streak</span>
          <span className="font-mono text-orange-500 font-bold">{user.streak} Days</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-indigo-500 uppercase tracking-wider text-[10px] font-bold">Account Status</span>
          <span className="font-mono text-emerald-500 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4"/> VERIFIED
          </span>
        </div>
      </div>
      
      <p className="text-[10px] text-gray-500 text-center max-w-[200px] mt-8 uppercase tracking-widest">
        LootRush Simulation V2
      </p>
    </div>
  );
}
