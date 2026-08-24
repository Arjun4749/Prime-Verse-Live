import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Shield, Sparkles, Award, Star, Flame, Check, Trophy, Zap, Crown } from 'lucide-react';

interface AceTierUnlockOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  rankName?: string;
  playerName?: string;
}

export const AceTierUnlockOverlay: React.FC<AceTierUnlockOverlayProps> = ({
  isOpen,
  onClose,
  rankName = 'Ace Tier',
  playerName = 'ARENAxBOSS',
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger golden confetti burst
      const end = Date.now() + 2 * 1000;
      const colors = ['#FFD700', '#FF4500', '#D4FF33', '#FFFFFF', '#FFA500'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-hidden"
        >
          {/* Background Radial Glow & Rotating Light Rays */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-orange-600/30 via-yellow-500/20 to-red-600/30 blur-3xl pointer-events-none"
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="absolute w-[500px] h-[500px] border border-orange-500/20 rounded-full border-dashed pointer-events-none"
          />

          {/* Main Modal Card */}
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative bg-[#0d0f17] border-2 border-orange-500/60 rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-[0_0_80px_rgba(249,115,22,0.35)] space-y-6 overflow-hidden z-10"
          >
            {/* Top Shine Bar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
            />

            {/* Header Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/40 text-orange-400 text-xs font-mono font-black uppercase tracking-widest"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Admin Rank Update Approved</span>
            </motion.div>

            {/* Animated Ace Badge Crest */}
            <div className="relative py-2 flex justify-center">
              {/* Pulsing Aura Rings */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 m-auto w-32 h-32 rounded-full border-2 border-amber-400/50"
              />

              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="relative w-36 h-36 rounded-3xl bg-gradient-to-b from-amber-400 via-orange-600 to-red-700 p-1 shadow-[0_0_40px_rgba(251,191,36,0.6)] flex items-center justify-center transform rotate-45"
              >
                <div className="w-full h-full bg-[#0a0c12] rounded-[22px] flex flex-col items-center justify-center transform -rotate-45 p-2 border border-amber-400/30">
                  <Crown className="w-10 h-10 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                  <span className="text-xl font-black italic text-white uppercase font-mono tracking-tighter mt-1">
                    ACE
                  </span>
                  <div className="flex gap-1 text-amber-400 mt-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Title & Player Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-1.5"
            >
              <h2 className="text-2xl sm:text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 uppercase font-mono tracking-tight">
                {rankName.toUpperCase()} UNLOCKED!
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-medium">
                Congratulations, <span className="text-orange-400 font-bold">{playerName}</span>! Your seasonal rank has been updated to <span className="text-amber-400 font-black">{rankName}</span> by Tournament Admins.
              </p>
            </motion.div>

            {/* Unlocked Perks Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-2.5 text-left font-mono"
            >
              <div className="p-2.5 rounded-2xl bg-black/50 border border-orange-500/20 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Badge</span>
                  <span className="text-xs font-bold text-white">Ace Frame</span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-black/50 border border-orange-500/20 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Rating</span>
                  <span className="text-xs font-bold text-white">+500 Points</span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-black/50 border border-orange-500/20 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Priority</span>
                  <span className="text-xs font-bold text-white">Pro Matches</span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-black/50 border border-orange-500/20 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Title</span>
                  <span className="text-xs font-bold text-white">ACE DOMINATOR</span>
                </div>
              </div>
            </motion.div>

            {/* Claim Action Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 hover:from-amber-500 hover:to-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
              >
                <Check className="w-5 h-5 text-amber-200" />
                <span>Claim Ace Rank & Continue</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
