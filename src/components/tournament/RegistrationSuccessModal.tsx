import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Trophy, ShieldCheck, Swords, MapPin, Users, ArrowRight, Sparkles, Key, CheckCircle2, Crown } from 'lucide-react';
import { Tournament, Team } from '../../types';

interface RegistrationSuccessModalProps {
  tournament: Tournament;
  teamName: string;
  teamTag: string;
  captainName: string;
  onClose?: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  tournament,
  teamName,
  teamTag,
  captainName,
  onClose,
}) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 4000; // 4 seconds redirect

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        navigate(`/tournaments/${tournament.slug}`);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [tournament, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Glow Backdrop Effect */}
      <div className="absolute w-96 h-96 bg-gradient-to-r from-[#D4FF33]/20 via-orange-500/20 to-red-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Main Success Card */}
      <div className="bg-[#121420] border-2 border-[#D4FF33]/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(212,255,51,0.25)] space-y-6 text-center animate-modal-pop relative overflow-hidden">
        {/* Top Decorative Banner Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-[#D4FF33] to-cyan-400" />

        {/* Animated Trophy / Check Badge */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-[#D4FF33]/20 border border-[#D4FF33]/50 animate-lime-glow" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4FF33] to-amber-400 text-black flex items-center justify-center shadow-lg animate-checkmark-pop">
            <Trophy className="w-9 h-9 font-black" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-black text-white flex items-center justify-center shadow-md">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4FF33]/10 border border-[#D4FF33]/30 text-[#D4FF33] text-[10px] font-black uppercase tracking-widest font-mono">
            <Sparkles className="w-3 h-3" /> Registration Confirmed
          </div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase text-white font-mono tracking-tight">
            TEAM REGISTERED!
          </h2>
          <p className="text-xs text-gray-300 font-medium">
            Your squad is locked in for <span className="text-[#D4FF33] font-bold">{tournament.title}</span>
          </p>
        </div>

        {/* Registered Squad Details Box */}
        <div className="bg-black/60 border border-gray-800 rounded-2xl p-4 text-left space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-800/80">
            <span className="text-gray-400 text-[11px]">SQUAD NAME:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white uppercase">{teamName}</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold text-[10px]">
                [{teamTag}]
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[11px]">CAPTAIN:</span>
            <span className="font-bold text-gray-200">{captainName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[11px]">FORMAT & MAP:</span>
            <span className="font-bold text-cyan-400">{tournament.format} ({tournament.map})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[11px]">ENTRY FEE:</span>
            <span className="font-bold text-emerald-400">
              {tournament.entry_fee === 0 ? 'FREE ENTRY' : `₹${tournament.entry_fee} PAID`}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-gray-800/80 text-[11px]">
            <span className="text-gray-400">ROOM SLOT ALLOCATION:</span>
            <span className="text-[#D4FF33] font-extrabold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> AUTOMATIC SLOT PASSED
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => navigate(`/tournaments/${tournament.slug}`)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4FF33] to-lime-400 text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#D4FF33]/20"
          >
            Go to Tournament Details <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-orange-400" /> View Lobby Room Credentials
          </button>
        </div>

        {/* Redirecting Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Redirecting to tournament...</span>
            <span className="text-[#D4FF33] font-bold">{Math.ceil((progress / 100) * 4)}s</span>
          </div>
          <div className="w-full bg-black/80 rounded-full h-1.5 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-[#D4FF33] via-orange-400 to-emerald-400 h-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
