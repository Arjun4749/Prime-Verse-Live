import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, Trophy, Award, Zap, ShieldCheck, RefreshCw } from 'lucide-react';
import { UserProfile } from '../../types';
import { dbStore } from '../../services/dbStore';
import { Card } from '../ui/Card';

interface SeasonalRankCardProps {
  currentUser: UserProfile;
  onRankUpdated: () => void;
  onTriggerAceAnimation: () => void;
}

export const SeasonalRankCard: React.FC<SeasonalRankCardProps> = ({
  currentUser,
  onRankUpdated,
  onTriggerAceAnimation,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const currentRank = currentUser.rank || 'Crown I';
  const isAce = currentRank.toLowerCase().includes('ace');

  const handleQuickUpgradeToAce = () => {
    setIsUpdating(true);
    setTimeout(() => {
      dbStore.updateUserRank(currentUser.id, 'Ace Tier');
      onRankUpdated();
      onTriggerAceAnimation();
      setIsUpdating(false);
    }, 300);
  };

  const handleSetRank = (newRank: string) => {
    setIsUpdating(true);
    setTimeout(() => {
      dbStore.updateUserRank(currentUser.id, newRank);
      onRankUpdated();
      if (newRank.toLowerCase().includes('ace') || newRank === 'Ace') {
        onTriggerAceAnimation();
      }
      setIsUpdating(false);
    }, 300);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-[#10121d] via-[#0d0f17] to-[#14101d] border-orange-500/30 p-5 sm:p-6 space-y-4">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 border shadow-lg ${
              isAce
                ? 'bg-gradient-to-tr from-amber-500 to-red-600 border-amber-300 text-white shadow-orange-500/30'
                : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
            }`}
          >
            <Crown className="w-7 h-7" />
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                Seasonal Competitive Rank
              </span>
              <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[10px] font-mono font-bold">
                Season 12
              </span>
            </div>
            <h3 className="text-xl font-black italic text-white uppercase font-mono tracking-tight flex items-center gap-2">
              <span>{currentRank}</span>
              {isAce && (
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold not-italic">
                  TOP TIER
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Quick Admin Actions (Allows instant testing of Admin Rank update to Ace!) */}
        <div className="flex items-center gap-2 font-mono">
          <select
            value={currentRank}
            onChange={(e) => handleSetRank(e.target.value)}
            disabled={isUpdating}
            className="bg-black/60 border border-gray-800 rounded-xl px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="Bronze I">Bronze I</option>
            <option value="Silver I">Silver I</option>
            <option value="Gold I">Gold I</option>
            <option value="Platinum I">Platinum I</option>
            <option value="Crown I">Crown I</option>
            <option value="Ace">Ace Tier</option>
            <option value="Ace Master">Ace Master</option>
            <option value="Ace Dominator">Ace Dominator</option>
            <option value="Conqueror">Conqueror</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickUpgradeToAce}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Simulate Admin Rank Update to Ace Tier"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>{isUpdating ? 'Updating...' : 'Set Ace Tier'}</span>
          </motion.button>
        </div>
      </div>

      {/* Progress & Tier Perks Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-800/80 font-mono text-xs">
        <div className="p-3 bg-black/40 rounded-xl border border-gray-800/60">
          <span className="text-[10px] text-gray-400 block uppercase">Seasonal Points</span>
          <span className="text-sm font-bold text-amber-400">4,250 Rating Points</span>
        </div>

        <div className="p-3 bg-black/40 rounded-xl border border-gray-800/60">
          <span className="text-[10px] text-gray-400 block uppercase">Tier Status</span>
          <span className="text-sm font-bold text-white">
            {isAce ? 'Unlocked Exclusive Title' : 'Near Ace Upgrade'}
          </span>
        </div>

        <div className="p-3 bg-black/40 rounded-xl border border-gray-800/60">
          <span className="text-[10px] text-gray-400 block uppercase">Last Rank Update</span>
          <span className="text-xs font-bold text-gray-300">
            {currentUser.rank_updated_at
              ? new Date(currentUser.rank_updated_at).toLocaleDateString()
              : 'Admin Verified'}
          </span>
        </div>
      </div>
    </Card>
  );
};
