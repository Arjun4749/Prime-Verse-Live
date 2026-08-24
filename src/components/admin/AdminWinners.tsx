import React, { useState } from 'react';
import { Trophy, Plus, ShieldCheck, Upload, Check } from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { WinnerRecord } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const AdminWinners: React.FC = () => {
  const [winners, setWinners] = useState(dbStore.getWinnerRecords());
  const tournaments = dbStore.getTournaments();

  const [modalOpen, setModalOpen] = useState(false);
  const [newWinner, setNewWinner] = useState<Partial<WinnerRecord>>({
    tournament_id: tournaments[0]?.id || '',
    winning_team_name: 'GodLike eSports',
    winning_team_tag: 'GODL',
    winning_team_logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150',
    prize_amount: 10000,
    total_points: 45,
    kills: 22,
    winner_screenshot: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    verified: true,
    published: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const t = tournaments.find((item) => item.id === newWinner.tournament_id);
    const created = dbStore.saveWinnerRecord({
      ...newWinner,
      tournament_title: t?.title || 'BGMI Tournament',
    });

    dbStore.logAction('Approved Champion & Uploaded Payment Proof', 'WinnerRecord', created.id, '', created.winning_team_name);
    setWinners(dbStore.getWinnerRecords());
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Winner Verification & Proof Approval</h2>
          <p className="text-xs text-gray-400">Review prize transfers and publish verified champions.</p>
        </div>
        <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add Verified Champion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {winners.map((w) => (
          <Card key={w.id} glow="gold" className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  {w.tournament_title}
                </span>
                <h3 className="text-lg font-bold text-white">{w.winning_team_name}</h3>
              </div>
              <Badge variant="gold">
                <Trophy className="w-3.5 h-3.5" /> ₹{w.prize_amount.toLocaleString('en-IN')}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-black/60 rounded-lg">
                <span className="text-[10px] text-gray-400 uppercase block">Payment Proof</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Approved
                </span>
              </div>
              <div className="p-2 bg-black/60 rounded-lg">
                <span className="text-[10px] text-gray-400 uppercase block">Total Points</span>
                <span className="text-white font-mono font-bold">{w.total_points} pts</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Publish Champion & Upload Proof">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1">Select Tournament</label>
            <select
              value={newWinner.tournament_id}
              onChange={(e) => setNewWinner({ ...newWinner, tournament_id: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Winning Team Name</label>
              <input
                type="text"
                required
                value={newWinner.winning_team_name || ''}
                onChange={(e) => setNewWinner({ ...newWinner, winning_team_name: e.target.value })}
                className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Prize Reward (₹)</label>
              <input
                type="number"
                required
                value={newWinner.prize_amount || 0}
                onChange={(e) => setNewWinner({ ...newWinner, prize_amount: Number(e.target.value) })}
                className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Approved Payment Proof URL</label>
            <input
              type="text"
              required
              value={newWinner.payment_proof_url || ''}
              onChange={(e) => setNewWinner({ ...newWinner, payment_proof_url: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Victory Screenshot URL</label>
            <input
              type="text"
              value={newWinner.winner_screenshot || ''}
              onChange={(e) => setNewWinner({ ...newWinner, winner_screenshot: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit">
              Approve & Publish Winner Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
