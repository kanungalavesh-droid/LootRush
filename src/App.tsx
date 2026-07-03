import React, { useState } from 'react';
import { GameProvider, useGame } from './store/GameContext';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen, EarnScreen, StoreScreen, ProfileScreen } from './components/Screens';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

function ScreenRenderer({ activeTab }: { activeTab: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="h-full w-full absolute inset-0 z-10"
      >
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'earn' && <EarnScreen />}
        {activeTab === 'store' && <StoreScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </motion.div>
    </AnimatePresence>
  );
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const { theme } = useGame();

  return (
    <div className={cn(
      "w-full h-full max-w-md mx-auto relative shadow-2xl xl:rounded-[40px] xl:border-8 overflow-hidden flex flex-col font-sans select-none z-0 transition-colors duration-500",
      theme === 'dark' ? "bg-[#05050b] text-white xl:border-slate-900" : "bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-indigo-950 xl:border-indigo-100"
    )}>
      {/* Cinematic Background Blobs - Visible mainly in dark mode or subtly in light */}
      <div className={cn("absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-[-1] transition-colors", theme === 'dark' ? "bg-purple-600/20" : "bg-indigo-300/40")}></div>
      <div className={cn("absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none z-[-1] transition-colors", theme === 'dark' ? "bg-blue-600/20" : "bg-sky-300/40")}></div>
      <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none z-[-1] transition-colors", theme === 'dark' ? "bg-orange-500/10" : "bg-fuchsia-300/30")}></div>

      {/* Cyberpunk Corner Decorations */}
      <div className={cn("absolute bottom-10 left-10 w-20 h-20 border-l border-b rounded-bl-3xl pointer-events-none z-[-1] transition-colors", theme === 'dark' ? "border-purple-500/30" : "border-indigo-400/50")}></div>
      <div className={cn("absolute top-10 right-10 w-20 h-20 border-r border-t rounded-tr-3xl pointer-events-none z-[-1] transition-colors", theme === 'dark' ? "border-blue-500/30" : "border-sky-400/50")}></div>

      <TopBar />
      
      <div className="flex-1 relative overflow-hidden z-10 w-full mb-16">
        <ScreenRenderer activeTab={activeTab} />
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainLayout />
    </GameProvider>
  );
}
