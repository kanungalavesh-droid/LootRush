import { motion } from 'motion/react';
import { Home, Gift, ShoppingCart, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useGame } from '../store/GameContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'earn', label: 'Activities', icon: Gift },
  { id: 'store', label: 'Store', icon: ShoppingCart },
  { id: 'profile', label: 'Stats', icon: User },
];

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const { theme } = useGame();

  return (
    <footer className="absolute bottom-6 w-full px-6 flex justify-center z-40 pb-safe pointer-events-none">
      <div className={cn(
        "flex items-center justify-around w-full max-w-[340px] border rounded-full h-16 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-500",
        theme === 'dark' ? "bg-white/5 backdrop-blur-xl border-white/10" : "bg-white/90 backdrop-blur-xl border-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
      )}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 outline-none group"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill-bg"
                  className={cn("absolute inset-0 pointer-events-none", theme === 'dark' ? "bg-white/10" : "bg-indigo-100/50")}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              
              <Icon 
                className={cn(
                  "w-5 h-5 transition-all duration-300 z-10",
                  isActive 
                  ? "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] scale-110" 
                  : theme === 'dark' ? "text-gray-500 group-hover:text-gray-300" : "text-indigo-300 group-hover:text-indigo-500"
                )} 
              />
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider z-10 transition-colors duration-300",
                isActive 
                ? (theme === 'dark' ? "text-purple-200" : "text-purple-700") 
                : (theme === 'dark' ? "text-gray-500 group-hover:text-gray-300" : "text-indigo-400 group-hover:text-indigo-600")
              )}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="nav-pill-indicator"
                  className="absolute bottom-0 w-8 h-1 bg-gradient-to-r from-purple-500 to-blue-400 rounded-t-full shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </footer>
  );
}
