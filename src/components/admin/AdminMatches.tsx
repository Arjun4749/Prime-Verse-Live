import React, { useState } from 'react';
import { Plus, Key, Lock, Unlock, Check, Edit } from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Match, MatchStatus } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const AdminMatches: React.FC = () => {
  const tournaments = dbStore.getTournaments();
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(tournaments[0]?.id || '');
  const [matches, setMatches] = useState<Match[]>(dbStore.getMatches(selectedTournamentId));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Partial<Match> | null>(null);

  const handleTournamentSelect = (id: string) => {
    setSelectedTournamentId(id);
    setMatches(dbStore.getMatches(id));
  };

  const handleOpenCreate = () => {
    setEditingMatch({
      tournament_id: selectedTournamentId,
      match_number: matches.length + 1,
      match_title: `Match #${matches.length + 1}`,
      map: 'Erangel',
      scheduled_at: new Date(Date.now() + 3600000).toISOString(),
      status: 'Scheduled',
      room_id: '',
      room_password: '',
      room_release_at: new Date(Date.now() + 1800000).toISOString(),
    });
    setModalOpen(true);
  };

  const handleSaveMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;

    dbStore.saveMatch(editingMatch);
    dbStore.logAction(
      'Saved Match & Room Credentials',
      'Match',
      editingMatch.id,
      '',
      `Room ID: ${editingMatch.room_id || 'Hidden'}`
    );
    setMatches(dbStore.getMatches(selectedTournamentId));
    setModalOpen(false);
  };

  const handleReleaseRoomNow = (match: Match) => {
    const updated = {
      ...match,
      status: 'Room Released' as MatchStatus,
      room_release_at: new Date().toISOString(),
    };
    dbStore.saveMatch(updated);
    dbStore.logAction('Instant Room Release', 'Match', match.id, 'Locked', 'Released');
    dbStore.saveAnnouncement({
      tournament_id: match.tournament_id,
      title: `Room Details Released for ${match.match_title}`,
      content: `Room ID and Password for ${match.match_title} (${match.map}) are now active. Check your match details dashboard immediately.`,
      is_pinned: true,
    });
    setMatches(dbStore.getMatches(selectedTournamentId));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Match & Room Credentials Control</h2>
          <p className="text-xs text-gray-400">Configure room IDs, passwords, and release schedules.</p>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedTournamentId}
            onChange={(e) => handleTournamentSelect(e.target.value)}
            className="bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" /> Add Match
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {matches.map((m) => {
          const isReleased = m.status === 'Room Released' || m.status === 'Live';
          return (
            <Card key={m.id} glow={isReleased ? 'orange' : 'none'} className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={isReleased ? 'green' : 'gray'}>{m.status}</Badge>
                  <span className="text-xs font-mono font-bold text-orange-400">Match #{m.match_number} &bull; {m.map}</span>
                </div>
                <h3 className="text-base font-bold text-white">{m.match_title}</h3>
                <p className="text-xs text-gray-400 font-mono">
                  Scheduled: {new Date(m.scheduled_at).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Room Creds Preview for Admin */}
              <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-xs font-mono space-y-1 min-w-[200px]">
                <div className="flex justify-between">
                  <span className="text-gray-400">Room ID:</span>
                  <strong className="text-white">{m.room_id || 'Not Set'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Password:</span>
                  <strong className="text-blue-400">{m.room_password || 'Not Set'}</strong>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                {!isReleased && m.room_id && (
                  <Button variant="secondary" size="sm" onClick={() => handleReleaseRoomNow(m)}>
                    <Unlock className="w-3.5 h-3.5" /> Release Room Now
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingMatch(m);
                    setModalOpen(true);
                  }}
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Match & Room Credentials">
        <form onSubmit={handleSaveMatch} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1">Match Title</label>
            <input
              type="text"
              required
              value={editingMatch?.match_title || ''}
              onChange={(e) => setEditingMatch({ ...editingMatch, match_title: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Map Name</label>
              <input
                type="text"
                value={editingMatch?.map || 'Erangel'}
                onChange={(e) => setEditingMatch({ ...editingMatch, map: e.target.value })}
                className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Status</label>
              <select
                value={editingMatch?.status || 'Scheduled'}
                onChange={(e) => setEditingMatch({ ...editingMatch, status: e.target.value as MatchStatus })}
                className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Room Released">Room Released</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Secure Room Details */}
          <div className="p-3 bg-orange-950/20 border border-orange-500/30 rounded-xl space-y-3">
            <span className="font-bold text-orange-400 uppercase tracking-wide block">Room Credentials (Encrypted & Protected)</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Room ID</label>
                <input
                  type="text"
                  placeholder="e.g. 8810294"
                  value={editingMatch?.room_id || ''}
                  onChange={(e) => setEditingMatch({ ...editingMatch, room_id: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Room Password</label>
                <input
                  type="text"
                  placeholder="e.g. ARENA"
                  value={editingMatch?.room_password || ''}
                  onChange={(e) => setEditingMatch({ ...editingMatch, room_password: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Match & Credentials
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
