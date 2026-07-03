import { motion } from 'motion/react';
import { Sun, Moon, Coins as CoinsIcon, Key, PackageOpen, Zap } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { cn } from '../lib/utils';

export function TopBar() {
  const { user, theme, toggleTheme } = useGame();
  
  return (
    <header className="w-full px-6 pt-6 pb-2 flex justify-between items-center z-20 shrink-0">
      {/* App Logo */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
           {/* Background glow and lightning */}
           <div className="absolute inset-0 bg-purple-600 blur-[15px] opacity-60"></div>
           <Zap className="absolute text-yellow-400 w-10 h-10 opacity-80 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] z-0 rotate-12" />
           <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 p-[1.5px] shadow-2xl z-10 border border-yellow-500/50">
             <div className="w-full h-full rounded-[10.5px] flex items-center justify-center bg-gradient-to-br from-slate-800 to-black relative overflow-hidden">
               <div className="absolute inset-x-0 top-0 h-1/2 bg-yellow-400/20"></div>
               <PackageOpen className={cn("w-6 h-6 drop-shadow-[0_0_10px_rgba(168,85,247,1)]", theme === 'dark' ? "text-purple-400" : "text-purple-300")} />
             </div>
           </div>
        </div>
        <div className="flex flex-col justify-center -ml-1">
          <span className={cn("font-black italic text-[22px] tracking-tight uppercase leading-none drop-shadow-sm", theme === 'dark' ? "text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300" : "text-transparent bg-clip-text bg-gradient-to-b from-indigo-900 to-indigo-600")}>
            Loot
          </span>
          <span className="font-black italic text-[22px] tracking-wider uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-md -mt-1 outline-text">
            Rush
          </span>
        </div>
      </div>

      {/* Actions & Resources */}
      <div className="flex gap-3 items-center">
        {/* Toggle Theme */}
        <button 
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-full border transition-colors shadow-sm",
            theme === 'dark' ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" : "bg-white/60 border-indigo-200 text-indigo-700 hover:bg-white backdrop-blur-md"
          )}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Keys Pill */}
        <div className={cn(
          "px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-md",
          theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        )}>
          <Key className="w-4 h-4 text-blue-500 drop-shadow-sm" />
          <span className={cn("font-mono font-bold text-xs", theme === 'dark' ? "text-white" : "text-indigo-950")}>{user.keys}</span>
        </div>
        
        {/* Coins Pill */}
        <div className={cn(
          "px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-md",
          theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        )}>
          <CoinsIcon className="w-4 h-4 text-yellow-500 drop-shadow-sm" />
          <span className={cn("font-mono font-bold text-xs", theme === 'dark' ? "text-white" : "text-indigo-950")}>{user.coins}</span>
        </div>
      </div>
    </header>
  );
}
