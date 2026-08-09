import React from 'react';
import { Building2, Sliders, Scale, Heart, PlusCircle, Sparkles, MapPin } from 'lucide-react';
import { UserPreferences } from '../types';

interface NavbarProps {
  preferences: UserPreferences;
  onOpenPreferences: () => void;
  onOpenAddListing: () => void;
  onOpenComparison: () => void;
  savedCount: number;
  compareCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  preferences,
  onOpenPreferences,
  onOpenAddListing,
  onOpenComparison,
  savedCount,
  compareCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-zinc-950/70 backdrop-blur-md border-b border-zinc-800 text-zinc-100 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950 shadow-md shadow-emerald-500/20">
            <Building2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight uppercase text-zinc-100">
              Apt<span className="text-emerald-400">AI</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" /> Audit Active
            </span>
          </div>
        </div>

        {/* Current Active Preferences Summary Bar */}
        <div className="hidden lg:flex bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 gap-4 items-center">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-zinc-500 uppercase text-[10px] tracking-wider">Budget</span>
            <span className="text-zinc-100 font-medium">${preferences.minBudget.toLocaleString()} – ${preferences.maxBudget.toLocaleString()}</span>
          </div>
          <div className="w-px h-4 bg-zinc-800" />
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-zinc-500 uppercase text-[10px] tracking-wider">Target</span>
            <span className="text-zinc-100 font-medium truncate max-w-[160px]">{preferences.preferredNeighborhoods.slice(0, 2).join(', ')}</span>
          </div>
          <div className="w-px h-4 bg-zinc-800" />
          <button
            onClick={onOpenPreferences}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider cursor-pointer"
          >
            Refine
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenPreferences}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition cursor-pointer"
            title="Configure Budget, Workplace & Priorities"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Preferences</span>
          </button>

          <button
            onClick={onOpenComparison}
            disabled={compareCount === 0}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer relative ${
              compareCount > 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="bg-zinc-950 text-emerald-400 font-bold px-1.5 py-0.2 rounded text-[10px]">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAddListing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition cursor-pointer"
            title="Add Custom Listing to Evaluate"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Add Listing</span>
          </button>

          {/* Saved counter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-zinc-500'}`} />
            <span className="font-bold text-zinc-200 text-xs">{savedCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
