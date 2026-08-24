import React, { useState } from 'react';
import { Plus, Edit, Trash2, Trophy, MapPin, Calendar, Clock } from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Tournament, TournamentFormat, TournamentStatus } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const AdminTournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState(dbStore.getTournaments());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Partial<Tournament> | null>(null);

  const handleOpenCreate = () => {
    setEditingTournament({
      title: '',
      description: '',
      banner_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
      status: 'Registration Open',
      format: 'Squad',
      mode: 'TPP',
      map: 'Erangel',
      entry_type: 'Free',
      entry_fee: 0,
      prize_pool: 10000,
      max_teams: 32,
      start_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      start_time: '06:00 PM IST',
      rules: '1. Squad 4 players.\n2. No emulators.\n3. Account level 30+.',
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTournament?.title) return;

    dbStore.saveTournament(editingTournament);
    dbStore.logAction('Saved Tournament', 'Tournament', editingTournament.id, '', editingTournament.title);
    setTournaments(dbStore.getTournaments());
    setModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      dbStore.deleteTournament(id);
      dbStore.logAction('Deleted Tournament', 'Tournament', id, title, 'Deleted');
      setTournaments(dbStore.getTournaments());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Tournament Management</h2>
          <p className="text-xs text-gray-400">Create, edit, or publish esports tournaments.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" /> New Tournament
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map((t) => (
          <Card key={t.id} className="space-y-3">
            <div className="relative h-32 -mx-5 -mt-5 mb-2 overflow-hidden">
              <img src={t.banner_url} alt={t.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2">
                <Badge variant={t.status === 'Registration Open' ? 'green' : 'gray'}>{t.status}</Badge>
              </div>
            </div>

            <h3 className="text-base font-bold text-white line-clamp-1">{t.title}</h3>

            <div className="text-xs font-mono text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Prize Pool:</span>
                <strong className="text-amber-400">₹{t.prize_pool.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Format / Map:</span>
                <span className="text-gray-200">{t.format} &bull; {t.map}</span>
              </div>
              <div className="flex justify-between">
                <span>Teams Registered:</span>
                <span className="text-gray-200">{t.registered_teams}/{t.max_teams}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingTournament(t);
                  setModalOpen(true);
                }}
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(t.id, t.title)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tournament Settings">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1">Tournament Title</label>
            <input
              type="text"
              required
              value={editingTournament?.title || ''}
              onChange={(e) => setEditingTournament({ ...editingTournament, title: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Format</label>
              <select
                value={editingTournament?.format || 'Squad'}
                onChange={(e) => setEditingTournament({ ...editingTournament, format: e.target.value as TournamentFormat })}
                className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Squad">Squad</option>
                <option value="Duo">Duo</option>
                <option value="Solo">Solo</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Map Name</label>
              <input
                type="text"
                value={editingTournament?.map || 'Erangel'}
                onChange={(e) => setEditingTournament({ ...editingTournament, map: e.target.value })}
                className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Status</label>
              <select
                value={editingTournament?.status || 'Draft'}
                onChange={(e) => setEditingTournament({ ...editingTournament, status: e.target.value as TournamentStatus })}
                className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Draft">Draft</option>
                <option value="Registration Open">Registration Open</option>
                <option value="Registration Closed">Registration Closed</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Prize Pool (₹)</label>
              <input
                type="number"
                value={editingTournament?.prize_pool || 0}
                onChange={(e) => setEditingTournament({ ...editingTournament, prize_pool: Number(e.target.value) })}
                className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Banner Image URL</label>
            <input
              type="text"
              value={editingTournament?.banner_url || ''}
              onChange={(e) => setEditingTournament({ ...editingTournament, banner_url: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Tournament Rules</label>
            <textarea
              rows={4}
              value={editingTournament?.rules || ''}
              onChange={(e) => setEditingTournament({ ...editingTournament, rules: e.target.value })}
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Tournament
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
