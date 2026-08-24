import React, { useState } from 'react';
import { dbStore } from '../../services/dbStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Grid, Crown, RefreshCw, Send, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminSlotMatrixManager: React.FC = () => {
  const { addToast } = useToast();
  const tournaments = dbStore.getTournaments();
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>(tournaments[0]?.id || 'tr-1');
  const [selectedSlotForSwap, setSelectedSlotForSwap] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const slotMatrix = dbStore.getTournamentSlotMatrix(selectedTourneyId);
  const selectedTourney = tournaments.find((t) => t.id === selectedTourneyId);

  const handleSlotClick = (slotNumber: number) => {
    if (selectedSlotForSwap === null) {
      setSelectedSlotForSwap(slotNumber);
    } else {
      if (selectedSlotForSwap === slotNumber) {
        setSelectedSlotForSwap(null);
        return;
      }

      // Swap team in selectedSlotForSwap with team in slotNumber
      const slot1Data = slotMatrix.find((s) => s.slot_number === selectedSlotForSwap);
      const slot2Data = slotMatrix.find((s) => s.slot_number === slotNumber);

      if (slot1Data?.team) {
        dbStore.manualAssignSlot(selectedTourneyId, slot1Data.team.id, slotNumber);
      }
      if (slot2Data?.team) {
        dbStore.manualAssignSlot(selectedTourneyId, slot2Data.team.id, selectedSlotForSwap);
      }

      setStatusMessage(`Swapped Slot #${selectedSlotForSwap} with Slot #${slotNumber}!`);
      setSelectedSlotForSwap(null);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleBroadcastSlots = () => {
    // Send toast broadcast alert
    addToast({
      type: 'room_id',
      title: '📢 Admin Room Slot Pass Broadcast',
      message: `Automatic room slot assignments for '${selectedTourney?.title || 'Tournament'}' are live! Team Leaders must check their Dashboard for assigned Slot Numbers.`,
      linkUrl: '/dashboard',
      duration: 12000,
    });

    setStatusMessage('Broadcast sent to all Team Leaders!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <Card className="p-6 bg-[#0c0f1d] border border-orange-500/30 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Automatic Slot Management Engine
          </span>
          <h2 className="text-xl font-black text-white italic uppercase mt-0.5">
            25-Slot Lobby Room Matrix
          </h2>
        </div>

        {/* Tournament Selector */}
        <select
          value={selectedTourneyId}
          onChange={(e) => {
            setSelectedTourneyId(e.target.value);
            setSelectedSlotForSwap(null);
          }}
          className="px-3 py-2 bg-black border border-gray-800 rounded-xl text-xs text-white font-bold focus:border-orange-500 cursor-pointer"
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.registered_teams} Teams)
            </option>
          ))}
        </select>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Control Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-black/60 rounded-2xl border border-gray-800">
        <span className="text-xs text-gray-400">
          Click any two slots to swap squad positions manually.
        </span>

        <button
          onClick={handleBroadcastSlots}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Send className="w-4 h-4" />
          <span>Broadcast Slot Passes to Leaders</span>
        </button>
      </div>

      {/* 25 Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {slotMatrix.map((slot) => {
          const isSelectedForSwap = selectedSlotForSwap === slot.slot_number;

          return (
            <div
              key={slot.slot_number}
              onClick={() => handleSlotClick(slot.slot_number)}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-[105px] relative overflow-hidden ${
                isSelectedForSwap
                  ? 'bg-orange-950/60 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105 z-10'
                  : slot.is_occupied
                  ? 'bg-[#121628] border-gray-800 hover:border-gray-600 text-white'
                  : 'bg-[#090b14] border-dashed border-gray-800/80 text-gray-600 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    isSelectedForSwap
                      ? 'bg-orange-500 text-black'
                      : slot.is_occupied
                      ? 'bg-gray-800 text-gray-200'
                      : 'bg-gray-900 text-gray-600'
                  }`}
                >
                  SLOT #{String(slot.slot_number).padStart(2, '0')}
                </span>

                {slot.is_occupied && (
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </div>

              {slot.is_occupied ? (
                <div>
                  <p className="text-xs font-black text-white truncate">
                    [{slot.team?.tag}] {slot.team?.name}
                  </p>
                  <p className="text-[10px] text-orange-400 font-bold truncate mt-0.5">
                    Leader: {slot.captain?.game_name || 'Captain'}
                  </p>
                </div>
              ) : (
                <div className="text-[10px] text-gray-600 font-bold uppercase mt-auto">
                  Unallocated Slot
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
