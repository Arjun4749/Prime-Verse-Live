import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Key,
  Flame,
  X,
  Copy,
  Check,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  BellRing,
  Sparkles,
} from 'lucide-react';
import { useToast, ToastItem } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, triggerSimulatedToast } = useToast();
  const navigate = useNavigate();

  const [copiedField, setCopiedField] = useState<{ id: string; field: 'room' | 'pass' } | null>(null);

  const handleCopy = (id: string, text: string, field: 'room' | 'pass') => {
    navigator.clipboard.writeText(text);
    setCopiedField({ id, field });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end space-y-3 max-w-sm sm:max-w-md w-full px-4 pointer-events-none font-mono">
      {/* Active Toast Cards List */}
      <AnimatePresence>
        {toasts.map((toast) => {
          const isRoomId = toast.type === 'room_id';
          const isMatchStarting = toast.type === 'match_starting';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 50 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`pointer-events-auto w-full p-4 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-2 backdrop-blur-xl relative overflow-hidden flex flex-col space-y-3 ${
                isRoomId
                  ? 'bg-[#091512]/95 border-emerald-500/60 text-emerald-100 shadow-emerald-950/40'
                  : isMatchStarting
                  ? 'bg-[#181109]/95 border-amber-500/60 text-amber-100 shadow-amber-950/40'
                  : 'bg-[#0d101d]/95 border-gray-700 text-gray-200 shadow-black/60'
              }`}
            >
              {/* Header Badge & Title */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                      isRoomId
                        ? 'bg-emerald-500 text-black'
                        : isMatchStarting
                        ? 'bg-amber-400 text-black'
                        : 'bg-indigo-500 text-white'
                    }`}
                  >
                    {isRoomId && <Key className="w-5 h-5 font-black" />}
                    {isMatchStarting && <Flame className="w-5 h-5 font-black animate-bounce" />}
                    {!isRoomId && !isMatchStarting && <BellRing className="w-5 h-5" />}
                  </div>

                  <div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase border ${
                        isRoomId
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : isMatchStarting
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      }`}
                    >
                      {isRoomId ? 'Admin Room Alert' : isMatchStarting ? 'Match Starting Alert' : 'System Alert'}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white mt-0.5 leading-tight">
                      {toast.title}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-xl bg-black/40 hover:bg-black text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Toast Message */}
              <p className="text-xs text-gray-300 leading-relaxed">{toast.message}</p>

              {/* Room ID & Password Copy Box (if Room ID Toast) */}
              {toast.roomId && (
                <div className="p-2.5 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 uppercase font-bold block">Room ID & Pass</span>
                    <p className="text-xs font-black text-[#D4FF33]">
                      ID: <span className="text-white">{toast.roomId}</span>
                      {toast.roomPassword && (
                        <>
                          {' '}
                          • Pass: <span className="text-emerald-300">{toast.roomPassword}</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(toast.id, toast.roomId!, 'room')}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      {copiedField?.id === toast.id && copiedField.field === 'room' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-300" /> Copied ID
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy ID
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4FF33]" /> Live BGMI Alert
                </span>

                {toast.linkUrl && (
                  <button
                    onClick={() => {
                      navigate(toast.linkUrl!);
                      removeToast(toast.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow ${
                      isRoomId
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-black'
                        : isMatchStarting
                        ? 'bg-amber-400 hover:bg-amber-300 text-black'
                        : 'bg-[#D4FF33] hover:bg-[#c2ef26] text-black'
                    }`}
                  >
                    <span>Open Room Slot</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Persistent Quick Demo Test Bar */}
      <div className="pointer-events-auto bg-[#0a0c14]/90 border border-[#222222] hover:border-gray-700 p-2.5 rounded-2xl backdrop-blur-md shadow-2xl flex items-center gap-2 text-[10px] text-gray-300 font-mono">
        <span className="font-bold text-[#D4FF33] flex items-center gap-1">
          <BellRing className="w-3 h-3 animate-pulse text-[#D4FF33]" /> Alert System:
        </span>
        <button
          onClick={() => triggerSimulatedToast('match_starting')}
          className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-amber-300 font-bold transition-all cursor-pointer"
        >
          + Test Match Start
        </button>
        <button
          onClick={() => triggerSimulatedToast('room_id')}
          className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 text-emerald-300 font-bold transition-all cursor-pointer"
        >
          + Test Room ID
        </button>
      </div>
    </div>
  );
};
