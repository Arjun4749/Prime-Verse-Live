import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Key,
  ShieldCheck,
  Users,
  Copy,
  Check,
  Share2,
  Crown,
  Grid,
  Info,
  Trophy,
  ExternalLink,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { RoomSlotPass } from '../../types';
import { dbStore } from '../../services/dbStore';

interface SquadSlotPassCardProps {
  slotPass: RoomSlotPass;
}

export const SquadSlotPassCard: React.FC<SquadSlotPassCardProps> = ({ slotPass }) => {
  const [showMatrix, setShowMatrix] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedSlot = `SLOT #${String(slotPass.slot_number).padStart(2, '0')}`;
  const slotMatrix = dbStore.getTournamentSlotMatrix(slotPass.tournament_id);

  const handleCopyPass = async () => {
  const message = `🏆 PRIME VERSE TOURNAMENTS
🎮 AUTOMATIC SQUAD ROOM SLOT PASS ISSUED!

📌 Tournament: ${slotPass.tournament_title}
🎯 Allocated Room Slot: ${formattedSlot}
👥 Squad: [${slotPass.team_tag}] ${slotPass.team_name}
👑 Squad Leader: ${slotPass.captain_name} (BGMI ID: ${slotPass.captain_bgmi_id})
🗺️ Map: ${slotPass.map || 'Erangel'}
🔑 Room ID: ${slotPass.room_id || 'RELEASING 15 MINS PRIOR'}
🔒 Password: ${slotPass.room_password || '********'}

⚠️ INSTRUCTION FOR TEAM LEADER:
All 4 squad players MUST enter the custom room lobby and sit specifically in ${formattedSlot}.
Do NOT occupy other squad slots to avoid automatic displacement/kick.`;

  try {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  } catch (error) {
    console.error('Failed to copy slot pass:', error);
  }
};

  return (
    <Card className="p-0 overflow-hidden bg-[#0a0c14] border-2 border-[#D4FF33]/40 shadow-[0_0_50px_rgba(212,255,51,0.12)] font-mono relative">
      {/* Top Banner Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#17220a] via-[#0e161a] to-[#121626] border-b border-[#222222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D4FF33] text-black font-black text-lg flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(212,255,51,0.4)]">
            #{String(slotPass.slot_number).padStart(2, '0')}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF33]/20 text-[#D4FF33] border border-[#D4FF33]/40 text-[10px] font-bold uppercase flex items-center gap-1">
                <Crown className="w-3 h-3" /> Automatic Slot Issued
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Team Leader Pass</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              {slotPass.tournament_title}
            </h3>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showMatrix
                ? 'bg-[#D4FF33] text-black border-[#D4FF33]'
                : 'bg-[#141724] text-gray-300 border-gray-800 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{showMatrix ? 'Hide Lobby Matrix' : 'View 25-Slot Matrix'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-6">
        {!showMatrix ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Slot Pass Hero Badge */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-b from-[#131726] to-[#090b12] border border-gray-800 space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#D4FF33]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-2.5">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Assigned Slot Number</span>
                  <span className="text-[10px] text-[#D4FF33] font-bold">Lobby Reserved</span>
                </div>

                <div className="text-center py-2">
                  <span className="text-xs text-gray-400 font-bold uppercase block tracking-widest">
                    Your Squad Room Location
                  </span>
                  <p className="text-4xl sm:text-5xl font-black text-[#D4FF33] tracking-tight mt-1 drop-shadow-[0_0_20px_rgba(212,255,51,0.3)]">
                    {formattedSlot}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-gray-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Squad Name:</span>
                    <span className="font-bold text-white">[{slotPass.team_tag}] {slotPass.team_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Team Leader:</span>
                    <span className="font-bold text-[#D4FF33]">{slotPass.captain_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Leader BGMI ID:</span>
                    <span className="font-bold text-white">{slotPass.captain_bgmi_id}</span>
                  </div>
                </div>
              </div>

              {/* Copy Share Pass Button */}
              <button
                onClick={handleCopyPass}
                className="w-full py-2.5 rounded-xl bg-[#D4FF33] hover:bg-[#c3f024] text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4FF33]/20"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>Slot Pass Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Copy Slot Pass For Squad</span>
                  </>
                )}
              </button>
            </div>

            {/* Room Credentials & Squad Seating Instructions */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
              {/* Credentials Box */}
              <div className="p-4 rounded-2xl bg-[#121624] border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" /> Official Custom Room Credentials
                  </span>
                  <span className="text-[10px] text-gray-400">Map: {slotPass.map || 'Erangel'}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-black/60 border border-gray-800">
                    <span className="text-[9px] text-gray-400 uppercase font-bold block">Room ID</span>
                    <p className="text-sm sm:text-base font-black text-white mt-0.5">
                      {slotPass.room_id || 'PENDING'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-gray-800">
                    <span className="text-[9px] text-gray-400 uppercase font-bold block">Password</span>
                    <p className="text-sm sm:text-base font-black text-emerald-300 mt-0.5">
                      {slotPass.room_password || '******'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Leader Duty Protocol Alert */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Team Leader Slot Protocol</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-100">
                  As Squad Leader <strong className="text-white">{slotPass.captain_name}</strong>, you are responsible for instructing your 4 squad members to join the BGMI custom room lobby and sit exclusively in <strong className="text-[#D4FF33] underline">{formattedSlot}</strong>.
                </p>
              </div>

              {/* Assigned Members Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Assigned Squad Roster in {formattedSlot} ({slotPass.members.length} Players)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {slotPass.members.map((m, idx) => (
                    <div
                      key={m.player_id || idx}
                      className="p-2.5 rounded-xl bg-[#111422] border border-gray-800 text-xs space-y-0.5"
                    >
                      <span className="text-[9px] text-gray-500 uppercase font-bold block">
                        P{idx + 1} • {m.role || 'Player'}
                      </span>
                      <p className="font-bold text-white truncate">{m.game_name}</p>
                      <p className="text-[9px] text-gray-400 font-mono">ID: {m.player_id}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 25-Slot BGMI Lobby Room Matrix View */
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Grid className="w-4 h-4 text-[#D4FF33]" />
                  BGMI Custom Room 25-Slot Allocation Matrix
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Live distribution of registered squad slots for {slotPass.tournament_title}
                </p>
              </div>
              <span className="text-[10px] text-[#D4FF33] font-bold bg-[#D4FF33]/10 px-2.5 py-1 rounded-full border border-[#D4FF33]/30">
                Your Squad: {formattedSlot}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {slotMatrix.map((slot) => {
                const isMySquad = slot.slot_number === slotPass.slot_number;

                return (
                  <div
                    key={slot.slot_number}
                    className={`p-3 rounded-2xl border transition-all flex flex-col justify-between h-[90px] ${
                      isMySquad
                        ? 'bg-[#18260c] border-[#D4FF33] text-white shadow-[0_0_15px_rgba(212,255,51,0.2)]'
                        : slot.is_occupied
                        ? 'bg-[#121522] border-gray-800 text-gray-300 hover:border-gray-700'
                        : 'bg-[#0b0d14] border-dashed border-gray-800/80 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          isMySquad
                            ? 'bg-[#D4FF33] text-black'
                            : slot.is_occupied
                            ? 'bg-gray-800 text-gray-300'
                            : 'bg-gray-900 text-gray-600'
                        }`}
                      >
                        SLOT #{String(slot.slot_number).padStart(2, '0')}
                      </span>
                      {isMySquad && (
                        <span className="text-[9px] font-bold text-[#D4FF33] uppercase animate-pulse">
                          YOUR SQUAD
                        </span>
                      )}
                    </div>

                    {slot.is_occupied ? (
                      <div className="mt-1">
                        <p className="text-xs font-extrabold text-white truncate">
                          [{slot.team?.tag}] {slot.team?.name}
                        </p>
                        <p className="text-[9px] text-gray-400 truncate">
                          Leader: {slot.captain?.game_name || 'Assigned'}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-600 font-bold uppercase mt-auto">
                        OPEN SLOT
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

