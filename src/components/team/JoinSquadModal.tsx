import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Key,
  Swords,
  CheckCircle2,
} from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Team, UserProfile } from '../../types';

interface JoinSquadModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onJoinedSuccess: (team: Team) => void;
  initialCode?: string;
}

export const JoinSquadModal: React.FC<JoinSquadModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onJoinedSuccess,
  initialCode = '',
}) => {
  const [inviteCode, setInviteCode] = useState(initialCode);
  const [gameName, setGameName] = useState(currentUser.game_name || '');
  const [bgmiId, setBgmiId] = useState(currentUser.bgmi_id || '');
  const [previewData, setPreviewData] = useState<{ team: Team } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto look up squad when inviteCode changes
  useEffect(() => {
    if (inviteCode.trim().length >= 4) {
      const found = dbStore.getInviteByCode(inviteCode.trim());
      if (found) {
        setPreviewData({ team: found.team });
        setErrorMessage(null);
      } else {
        setPreviewData(null);
      }
    } else {
      setPreviewData(null);
    }
  }, [inviteCode]);

  useEffect(() => {
    if (initialCode) {
      setInviteCode(initialCode);
    }
  }, [initialCode]);

  if (!isOpen) return null;

  const handleJoinSquad = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!inviteCode.trim()) {
      setErrorMessage('Please enter a valid squad invite code.');
      return;
    }

    if (!gameName.trim() || !bgmiId.trim()) {
      setErrorMessage('In-game Name and BGMI Character ID are required.');
      return;
    }

    setIsSubmitting(true);

    const result = dbStore.acceptTeamInvite(
      inviteCode.trim(),
      currentUser,
      gameName.trim(),
      bgmiId.trim()
    );

    setIsSubmitting(false);

    if (result.success && result.team) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        if (result.team) onJoinedSuccess(result.team);
        onClose();
      }, 1500);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#11131F] border-2 border-orange-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-orange-500/20 relative space-y-5 animate-modal-pop">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white italic uppercase font-mono tracking-tight">
            Join Squad via Invite
          </h2>
          <p className="text-xs text-gray-400">
            Enter the unique shareable invite code provided by your team leader
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Invite Preview Card */}
        {previewData && (
          <div className="p-3.5 bg-black/60 border border-orange-500/40 rounded-2xl flex items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-3">
              <img
                src={previewData.team.logo_url}
                alt={previewData.team.name}
                className="w-10 h-10 rounded-xl object-cover border border-orange-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white uppercase">{previewData.team.name}</span>
                  <span className="text-[10px] font-bold text-orange-400">[{previewData.team.tag}]</span>
                </div>
                <span className="text-[10px] text-gray-400">
                  {previewData.team.members?.length || 0} Members in Squad
                </span>
              </div>
            </div>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-lg border border-emerald-500/30">
              Valid Squad
            </span>
          </div>
        )}

        {/* Join Form */}
        <form onSubmit={handleJoinSquad} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-gray-300 mb-1">
              Squad Invite Code
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. INV-GODL-8821"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full bg-black/60 border border-gray-800 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono uppercase font-bold placeholder-gray-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-gray-300 mb-1">
              Your In-Game Name (IGN)
            </label>
            <input
              type="text"
              placeholder="e.g. GODLxJONATHAN"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full bg-black/60 border border-gray-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-gray-300 mb-1">
              BGMI Character ID
            </label>
            <input
              type="text"
              placeholder="e.g. 5188820191"
              value={bgmiId}
              onChange={(e) => setBgmiId(e.target.value)}
              className="w-full bg-black/60 border border-gray-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Joining Squad...' : 'Accept & Join Squad'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
